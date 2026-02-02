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

                 const map = new Map();

                 for (const key of client.spec.apis) {
                  //existe varios models que vem do asterisk por hora focando apenas no essencial para as operações basicas!
                  if (key.description === "Asterisk dynamic configuration") {
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
                 }

                 /**
                   * @param {string} resource
                   * @param {string} httpMethod
                   * @param {string | undefined} pathParams
                   * @param {string | undefined} queryParams
                   * @returns {Promise}
                   */
                  const mountSwaggerPromise = (resource, httpMethod, pathParams, queryParams) => {
                    return swagger({
                        url: ariUrl,
                        requestInterceptor: (req) => {
                          let formatUrl = req.url.split("/api-docs")[0].concat(`/${resource}`)
                          // let formatBodyParam = {}
                          // for (const body of bodyParamsArray) {
                          //   formatBodyParam[body.name] = ""
                          // }

                          // if (Object.keys(formatBodyParam).length) {
                          //   req.body = JSON.stringify(formatBodyParam);

                          // }

                          if (pathParams) {
                            formatUrl = formatUrl.concat(pathParams);
                          }

                          if (queryParams) {
                            formatUrl = formatUrl.concat(queryParams);
                          }

                          req.url = formatUrl;
                          req.method = httpMethod;
                          req.headers["Authorization"] = `Basic ${credentials}`;
                          console.log(req);

                          return req
                        },
                        responseInterceptor: res => {
                          if (!res.ok) {
                            swaggerFailed(res)
                          }

                          if (res.spec) {
                            return res.spec;
                          }

                          return res;
                        }
                      });
                  }

                const knownPropertyTypes = [
                  "applications",
                  "asterisk",
                  "channels",
                  "bridges",
                  "deviceStates",
                  "endpoints",
                  "mailboxes",
                  "playbacks",
                  "sounds"
                ]

                for (const knownType of knownPropertyTypes) {
                  this[knownType] = {}

                  if (knownType === "endpoints") {
                    /**
                     * @param {Object} params
                     * @param {string} params.tech
                     * @param {string} params.resource
                     */
                    this[knownType]["get"] = (params) => {
                        if (!params) {
                          throw new Error("param faltou")
                        }

                        if (typeof params.tech !== "string" || !params.tech.trim()) {
                          throw new Error("tech is required")
                        }

                        if (typeof params.resource !== "string" || !params.resource.trim()) {
                          throw new Error("resource is required")
                        }

                        const pathParams = `/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}`;

                        return mountSwaggerPromise("endpoints", "GET", pathParams);
                    }

                    /**
                     * @param {Object} params
                     * @param {string} params.tech
                     * @returns {Promise<Array>} array de endpoints
                     */
                    this[knownType]["listByTech"] = (params) => {
                      if (!params || !params.tech) {
                        return mountSwaggerPromise("endpoints", "GET", "/PJSIP");
                      }

                      const pathParams = `/${encodeURIComponent(params.tech)}`;
                      return mountSwaggerPromise("endpoints", "GET", pathParams);
                    }

                    this[knownType]["list"] = () => mountSwaggerPromise("endpoints", "GET");

                    /**
                     * @param {Object} params
                     * @param {string} params.to
                     * @param {string} params.from
                     * @param {string | undefined} params.body
                     */
                    this[knownType]["sendMessage"] = (params) => {
                      if (typeof params !== "object") {
                        throw new Error("param object is required");
                      }

                      if (params.body) {
                        if (typeof params.body !== "string" || !params.body.trim()) {
                          throw new Error("body is string type");
                        }
                      }

                      if (typeof params.from !== "string" || !params.from.trim()) {
                        throw new Error("from is required")
                      }

                      if (typeof params.to !== "string" || !params.to.trim()) {
                        throw new Error("to is required")
                      }

                      const url = `endpoints/sendMessage`
                      const queryParams = `?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&body=${params.body ? encodeURIComponent(params.body) : undefined}`
                      return mountSwaggerPromise(url, "PUT", undefined, queryParams)
                    }

                    /**
                     * @param {Object} params
                     * @param {string} params.resource
                     * @param {string} params.tech
                     * @param {string} params.from
                     * @param {string | undefined} params.body
                     */
                    this[knownType]["sendMessageToEndpoint"] = (params) => {
                      if (typeof params !== "object") {
                        throw new Error("param object is required");
                      }

                      if (params.body) {
                        if (typeof params.body !== "string" || !params.body.trim()) {
                          throw new Error("body is string type");
                        }
                      }

                      if (typeof params.from !== "string" || !params.from.trim()) {
                        throw new Error("from is required")
                      }

                      if (typeof params.resource !== "string" || !params.resource.trim()) {
                        throw new Error("resource is required")
                      }

                      if (typeof params.tech !== "string" || !params.tech.trim()) {
                        throw new Error("tech is required")
                      }

                      const url = `endpoints/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}/sendMessage`

                      const queryParams = `?from=${encodeURIComponent(params.from)}&body=${params.body ? encodeURIComponent(params.body) : undefined}`
                      return mountSwaggerPromise(url, "PUT",undefined, queryParams)
                    }


                  }
                }
            })
            .then(() => {

              _.each(_resources.knownTypes, attachResourceCreators);

              //this.Endpoint();
              resolve();
            })
            .catch(error => {
              swaggerFailed(error)
            });
        })
        .catch(async err => {
          console.log(err);

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
          console.log(resourceType);

          return _resources[resourceType](this, id, values);
        };
      }

    })
      .then(() => {
        return {
          ...this,
          start: this.start,
          stop: this.stop
        }
      })
  };
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

async function mountEndpointsMethods() {

}

export {
  connect
}
