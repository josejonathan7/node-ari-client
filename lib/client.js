/**
 *  Client to ARI instance behaving as an EventEmitter for web socket events.
 *  The client contains properties representing ARI resources. Those properties
 *  themselves will contain properties representing callable operations on those
 *  resources.
 *
 *  @module ari-client
 *
 *  @copyright 2014, Digium, Inc.
 *  @license Apache License, Version 2.0
 *  @author Samuel Fortier-Galarneau <sgalarneau@digium.com>
 */

'use strict';

import events from "events"
import WebSocket from "ws";
import _ from "lodash"
import swagger from "swagger-client"
import backoff from "backoff-func"
import _resources from "./resources.js"
import _utils from "./utils.js"

//_resources.

/**
 *  Client is an Event Emitter that allows root level resources
 *  to be accessed.
 *
 *  @class Client
 *  @constructor
 *  @param {string} url - The URL to the ARI instance
 *  @param {string} user - The username for the ARI instance
 *  @param {string} pass - The password for the ARI instance
 *  @prop {Connection} _connection - connection parts to an ARI instance
 *  @prop {Object} _instanceListeners - array of instance objects for
 *    instances that registered for scoped events keyed by event type
 */
// Make Client an Event Emitter
class Client extends events.EventEmitter {
  constructor(baseUrl, user, pass) {
    super();
    events.EventEmitter.call(this);

    // Store connection settings for prototype methods
    var parsedUrl = new URL(baseUrl);
    /**
     * Connection parts to an ARI instance.
     *
     * @class Connection
     * @prop {string} protocol
     * @prop {string} host
     * @prop {string} hostname
     * @prop {string} user - username for ARI instance
     * @prop {string} pass - password for ARI instance
     */
    this._connection = {
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      hostname: parsedUrl.hostname,
      // support optional path prefix in asterisk http.conf
      prefix: parsedUrl.pathname === '/' ? '' : parsedUrl.pathname,
      user: user,
      pass: pass
    };

    // Keep track of instance event listeners. once true means that the callback
    // will only be called once for the given event.
    //
    // {
    //   'eventType': [{'once': false, 'id': uniqueId, 'callback': callback}...],
    //   ...
    // }
    this._instanceListeners = {};
  }


  /**
   *  Creates the web socket connection, subscribing to the given apps.
   *
   *  @memberof Client
   *  @method start
   */
  start(apps, subscribeAll, callback) {
    // are we currently processing a WebSocket error?
    this.processingError = false;

    // Perform argument renaming for backwards compatibility
    if (typeof subscribeAll === 'function') {
      callback = subscribeAll;
      subscribeAll = null;
    }

    return new Promise((resolve, reject) => {
      // Rewrite resolve/reject functions so they can only be called once and
      // each disables the other when called.
      resolve = _.once(resolve);
      reject = _.once(reject);

      const applications = (_.isArray(apps)) ? apps.join(',') : apps;
      const protocol = this._connection.protocol === 'https:' ? 'wss' : 'ws'
      const wsUrl = `${protocol}://${this._connection.host}${this._connection.prefix}/ari/events?app=${applications}&api_key=${encodeURIComponent(this._connection.user)}:${encodeURIComponent(this._connection.pass)}`

      // var wsUrl = util.format(
      //   '%s://%s%s/ari/events?app=%s&api_key=%s:%s',
      //   (protocol),
      //   this._connection.host,
      //   this._connection.prefix,
      //   applications,
      //   encodeURIComponent(this._connection.user),
      //   encodeURIComponent(this._connection.pass)
      // );

      if (subscribeAll) {
        wsUrl += '&subscribeAll=true';
      }

      this.retry = backoff.create({
        delay: 100
      });

    connect();

    /**
     *  Connects to the application via WebSocket.
     *
     *  @method connect
     *  @memberof module:ari-client~Client~start
     *  @private
     */
    const connect = () => {
      this._ws = new WebSocket(wsUrl);

      this._ws.on('open', () => {
        processOpen()

      });
      this._ws.on('error', processError);
      this._ws.on('message', processMessage);
      this._ws.on('pong', processPong);
      this._ws.on('close', processClose);
    }

    /**
     *  Process pong received by web socket and emit event
     *
     *  @method processPing
     *  @memberof module:ari-client~Client~start
     *  @private
     */
    const processPong = () => {
      this.emit('pong');
    }

    /**
     *  Process error event.
     *
     *  @method processError
     *  @memberof module:ari-client~Client~start
     *  @private
     *  @param {Error} err - error object
     */
    const processError = (err) => {
      // was connection closed on purpose?
      if (this._wsClosed) {
        return;
      }

      this.processingError = true;

      reconnect(err);
    }

    /**
     *  Process open event.
     *
     *  @method processOpen
     *  @memberof module:ari-client~Client~start
     *  @private
     */
    const processOpen = () => {
      this.processingError = false;
      // reset backoff handler when we successfully connect
      this.retry = backoff.create({
        delay: 100
      });
      this.emit('WebSocketConnected');
      // onced, will not be called when an automatic reconnect succeeds.
      resolve();
    }

    /**
     *  Process close event. Attempt to reconnect to web socket with a back off
     *  to ensure we do not flood the server.
     *
     *  @method processClose
     *  @memberof module:ari-client~Client~start
     *  @private
     *  @param {Number} reason - reason code for disconnect
     *  @param {String} description - reason text for disconnect
     */
    const processClose = (reason, description) => {
      // was connection closed on purpose?
      if (this._wsClosed) {
        this._wsClosed = false;

        return;
      }

      if (!this.processingError) {
        reconnect();
      }
    }

    /**
     *  Attempts to reconnect to the WebSocket using a backoff function.
     *
     *  @method reconnect
     *  @memberof module:ari-client~Client~start
     *  @private
     *  @param {Error} [err] - error object
     */
    const reconnect = (err) => {
      const scheduled = this.retry(connect());
      const msg = err ? err.message : 'unknown';

      if (!scheduled) {
        // onced or disabled if initial connection succeeds.
        reject(new Error('Connection attempts exceeded WebSocketMaxRetries. ' + msg));

        this.emit('WebSocketMaxRetries', err);
      } else {
        this.emit('WebSocketReconnecting', err);
      }
    }

    /**
     *  Process message received by web socket and emit event.
     *
     *  @method processMessage
     *  @memberof module:ari-client~Client~start
     *  @private
     *  @param {Object} msg - the web socket message
     *  @param {Object} flags - web socket control flags
     */
    const processMessage = (msg, flags) => {
      let event = {};
      if (msg) {
        event = JSON.parse(msg);
      }
      const eventModels = this._swagger.apis.events.models;
      const eventModel = _.find(eventModels, function (item, key) {
        return key === event.type;
      });
      let resources = {};
      const instanceIds = [];

      // Pass in any property that is a known type as an object
      _.each(eventModel.properties, function (prop) {
        if (_.includes(_resources.knownTypes, prop.dataType) &&
            event[prop.name] !== undefined &&
            _resources[prop.dataType] !== undefined) {

          const instance = _resources[prop.dataType](this, event[prop.name]);
          resources[prop.name] = instance;

          // Keep track of which instance specific events we should
          // emit
          const listeners = this._instanceListeners[event.type];
          const instanceId = instance._id().toString();

          if (listeners) {
            const updatedListeners = [];

            _.each(listeners, function (listener) {
              if (listener.id === instanceId) {
                // make sure we do not duplicate events for a given instance
                if (!_.includes(instanceIds, instanceId)) {
                  instanceIds.push(instanceId);
                }

                // remove listeners that should only be invoked once
                if (!listener.once) {
                  updatedListeners.push(listener);
                }
              } else {
                updatedListeners.push(listener);
              }
            });

            this._instanceListeners[event.type] = updatedListeners;
          }
        }
      });

      const promoted = _.keys(resources).length;
      if (promoted === 1) {
        resources = resources[_.keys(resources)[0]];
      } else if (promoted === 0) {
        resources = undefined;
      }

      this.emit('*', event, resources);
      this.emit(event.type, event, resources);
      // If appropriate, emit instance specific events
      if (instanceIds.length > 0) {
        _.each(instanceIds, function (instanceId) {
          this.emit(`${event.type}-${instanceId}`,
            event,
            resources
          );
        });
      }
    }

    })//.asCallback(callback);
  };

  /**
   *  Closes the web socket connection.
   *
   *  @memberof Client
   *  @method stop
   */
  stop() {
    this._ws.close();
    this._wsClosed = true;
  };

  /**
   *  Pings the web socket
   *
   *  @memberof Client
   *  @method ping
   */
  ping() {
    if (this._ws === undefined || this._wsClosed) {
      return;
    }
    this._ws.ping();
  };

  /**
   *  Attaches the API endpoints and operations for those endpoints to the Client
   *  instance.
   *
   *  @memberof Client
   *  @method _attachApi
   *  @param {attachApiCallback} callback - callback invoked once API attached
   *  @returns {Q} promise - a promise that will resolve to a client
   */
  _attachApi() {
    return new Promise((resolve, reject) => {
      // Connect to API using swagger and attach resources on Client instance
      const ariUrl = `${this._connection.protocol}//${this._connection.host}${this._connection.prefix}/ari/api-docs/resources.json`
      const credentials =btoa(`${this._connection.user}:${this._connection.pass}`)

      fetch(ariUrl)
        .then(res => res)
        .then(async () => {
            const request = {
              url: ariUrl,
              requestInterceptor: req => {
                  req.headers["Authorization"] = `Basic ${credentials}`;
                  return req
              },
            }

            await swagger(request)
              .then(async client => {
                this._swagger = {
                  ...client.spec,
                  ready: true
                }

                // _.each(_resources.knownTypes, attachResourceCreators);

                 const map = new Map();

                 for (const key of client.spec.apis) {
                    const [a, b, c, d] = key.description.split(" ")
                    let name = a;
                    if (b) {
                      name = a.concat(`_${b}`)
                    }

                    if (c) {
                      name = name.concat(`_${c}`)
                    }

                    if (key.path.endsWith("rotate")) {
                        name = name.concat(`_${d}`)
                    }

                    map.set(name.toLowerCase(), key);
                 }

                 this.apis = map;

                 for (const [key, requestConfig] of Array.from(this.apis.entries())) {
                  this[key] = {}

                  for (const operation of requestConfig.operations) {
                    let responseType = operation.responseClass;
                    const requestType = operation.httpMethod;
                    const nickName = operation.nickname;

                    let multi = false;
                    const regexArr = _resources.swaggerListTypeRegex.exec(responseType);
                    if (regexArr !== null) {
                       responseType = regexArr[1];
                       multi = true;
                     }
                     const params = operation.parameters;
                     console.log(responseType);
                     console.log(params);

                    const swaggerReq = await swagger({
                      url: ariUrl,
                      method: requestType,
                      requestInterceptor: req => {
                        req.url = req.url.split("/api-docs")[0].concat(requestConfig.path)
                        //req.method = operation.httpMethod
                        req.headers["Authorization"] = `Basic ${credentials}`;
                        console.log(req);
                        return req
                      },
                      responseInterceptor: res => {
                        if (!res.ok) {
                          swaggerFailed(res)
                        }
                        return res;
                      }
                    });

                    this[key][nickName] = swaggerReq

                  }
                }




                // console.log(client.spec.apis);

                // const resource = client.spec.apis[1]
                // const operation = resource.operations[0];
                // const params = operation.parameters
                // console.log(resource);

                // console.log(params);


                // const d = await swagger({
                //     url: ariUrl,
                //     method: operation.httpMethod,
                //     requestInterceptor: req => {
                //       req.url = req.url.split("/api-docs")[0].concat(resource.path)
                //       req.method = operation.httpMethod
                //       req.headers["Authorization"] = `Basic ${credentials}`;
                //       console.log(req);
                //         return req
                //     },
                //   })

                // console.log(d);


                //swaggerLoaded()
            })
            .catch(error => {
              swaggerFailed(error)
            });
        })
        .catch(async err => {
          console.log(await err);

          if (err.cause.code) {
            if (['ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'EHOSTUNREACH'].indexOf(err["cause"].code) !== -1) {
              err.name = 'HostIsNotReachable';
              this.emit('APILoadError', err);
              reject(err);
            }
          }

          err.name = "BadGateway"
          this.emit("APINetworkError", err)
          reject(err)
        })

      /**
       *  Success handler for swagger connect.
       *
       *  @callback swaggerConnectSuccessCallback
       *  @method swaggerLoaded
       *  @memberof module:ari-client~Client~_attachApi
       *  @private
       */
      const swaggerLoaded = () => {
        if(this._swagger.ready === true) {
          // Attach resources to client
          _.each(_.keys(this._swagger.apis), attachResource);

          // Attach resource creators to client
          _.each(_resources.knownTypes, attachResourceCreators);

          resolve(this);
        }
      }

      /**
       *  Failure handler for swagger connect.
       *
       *  @callback swaggerConnectFailureCallback
       *  @method swaggerFailed
       *  @memberof module:ari-client~Client~_attachApi
       *  @private
       */
      const swaggerFailed = (err) => {
        this.emit('APILoadError', err);
        reject(err);
      }

      /**
       *  Attach resource creators to Client instance to enable id generation.
       *
       *  Optionally, a values object can be used to set certain values on the
       *  resource instance.
       *
       *  If the first argument is a string, it is used as an id.
       *
       *  @callback attachResourceCreatorsCallback
       *  @method attachResourceCreators
       *  @memberof module:ari-client~Client~_attachApi
       *  @private
       *  @param {string} resourceType - the type of the resource to setup a
       *    create method for
       */
      const attachResourceCreators = (resourceType) => {
        this[resourceType] = function (id, values) {
          return _resources[resourceType](this, id, values);
        };
      }

      /**
       *  Attach resources and operations to Client instance.
       *
       *  @callback attachResourceCallback
       *  @method attachResource
       *  @memberof module:ari-client~Client~_attachApi
       *  @private
       *  @param {string} resource - the name of the resource
       */
      const attachResource = (resource) => {
        this[resource] = {};
        const operations = this._swagger.apis[resource].operations;

        for (const key of Object.keys(operations)) {
          this.#attachOperation(resource, key)
        }

      }
    });
  };

  // Attach operation to resource
  #attachOperation(resource, operation) {
    const oper = this._swagger.apis[resource].operations[operation];
    let respType = oper.type;
    let multi = false;
    const regexArr = _resources.swaggerListTypeRegex.exec(respType);
    if (regexArr !== null) {
      respType = regexArr[1];
      multi = true;
    }
    const params = oper.parameters;

    this[resource][operation] = this.#callSwagger(resource, operation, respType, multi, params)
  }

/**
   *  Responsible for calling API through Swagger.
   *
   *  @callback attachResourceCallback
   *  @memberof module:ari-client~Client~_attachApi~attachResource
   *  @method callSwagger
   *  @private
   *  @param {Object} parameters - parameters to swagger
   *  @param {Function} callback - callback invoked with swagger response
   *  @returns {Q} promise - a promise that will resolve to a client
   */
  async #callSwagger(resource, operation, respType, multi, params) {
    let args = _.toArray(arguments);
    // Separate user callback from other args
    let options = _.first(args);
    const userCallback = (_.isFunction(_.last(args))) ? _.last(args)
                                                    : undefined;

    return new Promise(async (innerResolve, innerReject) => {
      // Handle error from Swagger
      const swaggerError = (err) => {
        if (err && err.data) {
          err = new Error(err.data.toString('utf-8'));
        }

        innerReject(err);
      }
      args = [];

      if (options === undefined || options === null ||
          _.isFunction(options) || _.isArray(options)) {
      } else if (Array.isArray(params)) {
        // Swagger can alter options passed in
        options = _.clone(options);
        // convert body params for swagger
        options = _utils.parseBodyParams(params, options);
      }

      args.push(options);

      // Inject response processing callback
      args.push((k) => this.#processResponse(k, respType, multi));
      // Inject error handling callback
      args.push(swaggerError);

      // Run operation against Swagger
      // console.log(resource, operation);

      // console.log(await this._swagger.apis[resource].operations[operation]);
      // return

      const c = {
        httpMethod: 'POST',
        since: [ '12.0.0' ],
        summary: 'Set the value of a global variable.',
        nickname: 'setGlobalVar',
        responseClass: 'void',
        parameters: [
                {
                  name: 'variable',
                  description: 'The variable to set',
                  paramType: 'query',
                  required: true,
                  allowMultiple: false,
            dataType: 'string'
          },
          {
            name: 'value',
            description: 'The value to set the variable to',
            paramType: 'query',
            required: false,
            allowMultiple: false,
            dataType: 'string'
          }
        ],
        errorResponses: [ { code: 400, reason: 'Missing variable parameter.' } ]
      }

     const request = {
              // url: ariUrl,
              // requestInterceptor: req => {
              //     req.headers["Authorization"] = `Basic ${credentials}`;
              //     return req
              // },
        //...c
      }

      await swagger.apply(null, args)
        .then(c => {
          console.log(c);

        })
        .catch(err => {
          console.log(err);

        })

      // await swagger(request)
      // .then(client => {
      //     this._swagger = {
      //       ...client.spec,
      //       ready: true
      //     }

      //     swaggerLoaded()
      // })
      // .catch(error => {
      //   swaggerFailed(error)
      // });

      //console.log(this._swagger.apis[resource].operations[operation].apply(null, args));

      //await this._swagger.apis[resource].operations[operation];


    })//.asCallback(userCallback);
  }


  /**
   *  Process response from Swagger.
   *
   *  @callback callSwaggerSuccessCallback
   *  @method processResponse
   *  @memberof
   *    module:ari-client~Client~_attachApi~attachResource~callSwagger
   *  @private
   *  @param {Object} response - response from swagger
   */
  #processResponse (response, respType, multi) {
    let result;

    if (respType === 'binary') {
      result = Buffer.from(response.data);
    } else {
      result = response.data.toString('utf-8');
      if (respType !== null && result) {
        result = JSON.parse(result);
      }
    }

    if (_.includes(_resources.knownTypes, respType) &&
        _resources[respType] !== undefined) {

      if (multi) {
        result = _.map(result, function (obj) {
          return _resources[respType](
            this,
            obj
          );
        });
      } else {
        result = _resources[respType](
          this,
          result
        );
      }
    }

    return result
  }


}

/**
 *  Create an instance of Client using the provided connection options and call
 *  the provided callback once the API has been attached to the Client.
 *
 *  @method connect
 *  @memberof module:ari-client
 *  @param {string} url - The URL to the ARI instance
 *  @param {string} user - The username for the ARI instance
 *  @param {string} pass - The password for the ARI instance
 *  @param {Client-clientCallback} cb -
 *    The callback to be called upon connection
 *  @returns {Q} promise - a promise that will resolve to a client
 */
function connect(baseUrl, user, pass,
    /**
     *  @callback connectCallback
     *  @memberof module:ari-client
     *  @param {Error} err - error object if any, null otherwise
     *  @param {Client} ari - ARI client instance
     */
    callback) {

  var client = new Client(baseUrl, user, pass);
  client.setMaxListeners(0);

  return client._attachApi()//.asCallback(callback);
};

export {
  connect
}
