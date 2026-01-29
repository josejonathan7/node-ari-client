/**
 *  First class object Resources found in ARI. Properties are attached to these
 *  instances to provide instance specific callable operations.
 *
 *  @module resources
 *
 *  @copyright 2014, Digium, Inc.
 *  @license Apache License, Version 2.0
 *  @author Samuel Fortier-Galarneau <sgalarneau@digium.com>
 */

'use strict';
import _ from 'lodash'
import { randomUUID } from "crypto"
import _utils from './utils.js';

// List of known resources to instantiate as first class object
const knownTypes = [
  'Application',
  'Asterisk',
  'Channel',
  'Bridge',
  'DeviceState',
  'Endpoint',
  'LiveRecording',
  'Mailbox',
  'Playback',
  'Sound',
  'StoredRecording'
];

// Used to convert lists of resources to lists of objects
const swaggerListTypeRegex = /List\[([A-Za-z]+)\]/;

/**
 * Abstract ARI Resource.
 *
 * @class
 * @constructor
 * @param {Client} client - client instance
 * @param {string} id - resource identifier
 * @param {Object} objValues - ownProperties to be copied on the instance
 * @prop {Client} _client - ARI client instance
 * @prop {string} id - resource identifier
 */
class Resource {
    /**
     *  Alias for on.
     *
     *  @method addListener
     *  @memberof module:resources~Resource
     *  @param {string} event - event name
     *  @param {onceCallback} callback - callback invoked on event
     */
    addListener = this.on;
    _client;
    _id;
    _generatedId;

    constructor (client, id, objValues) {
      this._client = client;
      // id is optional
      if (!objValues) {
        objValues = id;
      }

      _.each(_.keys(objValues), function (key) {
        this[key] = objValues[key];
      });

      // if creation did not come from swagger, generate id
      if (!objValues) {
        this.generateId()
      }

      // if second argument is a string, use it as an id
      if (_.isString(id)) {
        this._id(id);
        this._generatedId = true;
      }
    }

    /**
     *  Generates a unique id for the resource.
     *
     *  @method generateId
     *  @memberof module:resources~Resource
     */
    generateId() {
      this._id(randomUUID());
      this._generatedId = true;
    };

    /**
     *  Attaches an event to the client.
     *
     *  @method on
     *  @memberof module:resources~Resource
     *  @param {string} event - event name
     *  @param {onCallback} callback - callback invoked on event
     */
    on(event,
        /**
         *  @callback onCallback
         *  @memberof module:resources~Resource
         *  @param {Object} event - full event object
         *  @param {Object} instance(s) - single resource instance or object of
         *  resource instances with callable operations attached
         */
        callback) {
      const id = this._id() && this._id().toString();
      const listeners = this._client._instanceListeners;

      // register event for this instance
      if (!listeners[event]) {
        listeners[event] = [];
      }

      listeners[event].push({once: false, id, callback});
      this._client.on(`${event}-${id}`, callback);
    };

    /**
     *  Attaches an event to the client to be emitted once (not yet implemented).
     *
     *  @method once
     *  @memberof module:resources~Resource
     *  @param {string} event - event name
     *  @param {onceCallback} callback - callback invoked on event
     */
    once(event,
        /**
         *  @callback onceCallback
         *  @memberof module:resources~Resource
         *  @param {Object} event - full event object
         *  @param {Object} instance(s) - single resource instance or object of
         *  resource instances with callable operations attached
         */
        callback) {
      const id = this._id() && this._id().toString();
      const listeners = this._client._instanceListeners;

      // register event for this instance
      if (!listeners[event]) {
        listeners[event] = [];
      }

      listeners[event].push({once: true, id, callback});
      this._client.once(`${event}-${id}`, callback);
    };

    /**
     *  Unattached the given callback for the given event from this resource.
     *
     *  @method removeListener
     *  @memberof module:resources~Resource
     *  @param {string} event - event name
     *  @param {Function} callback - the callback to unattach
     */
    removeListener(event, callback) {
      const id = this._id() && this._id().toString();
      const listeners = this._client._instanceListeners;

      // unregister event for this instance
      if (listeners[event]) {
        const updatedListeners = _.filter(listeners[event], function(listener) {
          return listener.id !== id || listener.callback !== callback;
        });
        const instanceListeners = _.filter(listeners[event], function(listener) {
          return listener.id === id && listener.callback === callback;
        });
        // if multiple, remove the last listener registered
        if (instanceListeners.length) {
          Array.prototype.push.apply(updatedListeners, instanceListeners);
          updatedListeners.splice(-1);
        }

        this._client._instanceListeners[event] = updatedListeners;
        this._client.removeListener(`${event}-${id}`, callback);
      }
    };

    /**
     *  Unattached all callbacks for the given event from this resource.
     *
     *  @method removeAllListeners
     *  @memberof module:resources~Resource
     *  @param {string} event - event name
     */
    removeAllListeners(event) {
      const id = this._id() && this._id().toString();
      const listeners = this._client._instanceListeners;

      // unregister event for this instance
      if (listeners[event]) {
        const updatedListeners = _.filter(listeners[event], function(listener) {
          return listener.id !== id;
        });

        this._client._instanceListeners[event] = updatedListeners;
        this._client.removeAllListeners(`${event}-${id}`);
      }
    };
}

/**
 *  Application object for application API responses.
 *
 *  @class Application
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Application extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~Application
   */
  _param = 'applicationName';

  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Application
   */
  _resource = 'applications';

  constructor(client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the application.
   *
   *  @method _id
   *  @memberof module:resources~Application
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.name = value;
    } else {
      return this.name;
    }
  }
}

/**
 *  Asterisk object for asterisk API responses.
 *
 *  @class Asterisk
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Asterisk extends Resource {
  /**
   * The name of the identifier field used when passing as parameter.
   *
   * @member {string} _param
   * @memberof module:resources~Asterisk
   */
  _param = '';

  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Asterisk
   */
  _resource = 'asterisk';

  constructor(client, objValues) {
    Resource.call(this, client, undefined, objValues);
  }
}

/**
 *  Bridge object for bridge API responses.
 *
 *  @class Bridge
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Bridge extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~Bridge
   */
  _param = 'bridgeId';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Bridge
   */
  _resource = 'bridges';

  /**
   *  Used to pass generated ids into create methods.
   *
   *  @member {Object} _createMethods
   *  @memberof module:resources~Bridge
   *  @prop {Object} create - create method config
   *  @prop {string} create.param - parameter name to be passed in
   *  @prop {Object} play - play method config
   *  @prop {string} play.param - parameter name to be passed in
   *  @prop {boolean} play.requiresInstance - whether instance is required to be
   *    passed in
   *  @prop {Object} record - record method config
   *  @prop {string} record.param - parameter name to be passed in
   *  @prop {boolean} record.requiresInstance - whether instance is required to be
   *    passed in
   */
  _createMethods = {
    create: {
      param: Bridge.prototype._param
    },
    // this is not currently supported in ARI
    play: {
      param: 'playbackId',
      requiresInstance: true
    },
    record: {
      param: 'name',
      requiresInstance: true
    }
  };

  constructor(client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the bridge.
   *
   *  @method _id
   *  @memberof module:resources~Bridge
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.id = value;
    } else {
      return this.id;
    }
  };
}

/**
 *  Channel object for channel API responses.
 *
 *  @class Channel
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Channel extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~Channel
   */
  _param = 'channelId';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Channel
   */
  _resource = 'channels';

  /**
   *  Used to pass generated ids into create methods.
   *
   *  @member {Object} _createMethods
   *  @memberof module:resources~Channel
   *  @prop {Object} create - create method config
   *  @prop {string} create.param - parameter name to be passed in
   *  @prop {Object} originate - originate method config
   *  @prop {string} originate.param - parameter name to be passed in
   *  @prop {Object} snoopChannel - snoopChannel method config
   *  @prop {string} snoopChannel.param - parameter name to be passed in
   *  @prop {boolean} snoopChannel.requiresInstance - whether instance is required
   *    to be passed in
   *  @prop {Object} play - play method config
   *  @prop {string} play.param - parameter name to be passed in
   *  @prop {boolean} play.requiresInstance - whether instance is required to be
   *    passed in
   *  @prop {Object} record - record method config
   *  @prop {string} record.param - parameter name to be passed in
   *  @prop {boolean} record.requiresInstance - whether instance is required to be
   *    passed in
   *  @prop {Object} externalMedia - create method config
   *  @prop {string} externalMedia.param - parameter name to be passed in
   */
  _createMethods = {
    create: {
      param: Channel.prototype._param
    },
    originate: {
      param: Channel.prototype._param
    },
    snoopChannel: {
      param: 'snoopId',
      requiresInstance: true
    },
    play: {
      param: 'playbackId',
      requiresInstance: true
    },
    record: {
      param: 'name',
      requiresInstance: true
    },
    externalMedia: {
      param: Channel.prototype._param
    }
  };

  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the channel.
   *
   *  @method _id
   *  @memberof module:resources~Channel
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.id = value;
    } else {
      return this.id;
    }
  };
}

/**
 *  DeviceState object for deviceState API responses.
 *
 *  @class DeviceState
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class DeviceState extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~DeviceState
   */
  _param = 'deviceName';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~DeviceState
   */
  _resource = 'deviceStates';

  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the deviceState.
   *
   *  @method _id
   *  @memberof module:resources~DeviceState
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.name = value;
    } else {
      return this.name;
    }
  };
}

/**
 *  Endpoint object for endpoint API responses.
 *
 *  @class Endpoint
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Endpoint extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~Endpoint
   */
  _param = ['tech', 'resource'];
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Endpoint
   */
  _resource = 'endpoints';

  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the endpoint.
   *
   *  @method _id
   *  @memberof module:resources~Endpoint
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    // multi field id
    if (value) {
      this.technology = value.technology;
      this.resource = value.resource;
    } else {
      return {
        tech: this.technology,
        resource: this.resource,
        toString: function () {
          return `${this.technology}/${this.resource}`//util.format('%s/%s', self.technology, self.resource);
        }
      };
    }
  };
}

/**
 *  LiveRecording object for liveRecording API responses.
 *
 *  @class LiveRecording
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class LiveRecording extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~LiveRecording
   */
  _param = 'recordingName';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~LiveRecording
   */
  _resource = 'recordings';

  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the liveRecording.
   *
   *  @method _id
   *  @memberof module:resources~LiveRecording
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.name = value;
    } else {
      return this.name;
    }
  };
}

/**
 *  Mailbox object for mailbox API responses.
 *
 *  @class Mailbox
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Mailbox extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter..
   *
   *  @member {string} _param
   *  @memberof module:resources~Mailbox
   */
  _param = 'mailboxName';
  /**
   *  The name of this resource. .
   *
   *  @member {string} _resource
   *  @memberof module:resources~Mailbox
   */
  _resource = 'mailboxes';
  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }
  /**
   *  Get or set id for the mailbox.
   *
   *  @method _id
   *  @memberof module:resources~Mailbox
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.name = value;
    } else {
      return this.name;
    }
  };
}


/**
 *  Playback object for playback API responses.
 *
 *  @class Playback
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Playback extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter..
   *
   *  @member {string} _param
   *  @memberof module:resources~Playback
   */
  _param = 'playbackId';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Playback
   */
  _resource = 'playbacks';

  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the playback.
   *
   *  @method _id
   *  @memberof module:resources~Playback
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.id = value;
    } else {
      return this.id;
    }
  };
}

/**
 *  Sound object for sound API responses.
 *
 *  @class Sound
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class Sound extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~Sound
   */
  _param = 'soundId';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~Sound
   */
  _resource = 'sounds';


  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the sound.
   *
   *  @method _id
   *  @memberof module:resources~Sound
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.id = value;
    } else {
      return this.id;
    }
  };
}

/**
 *  StoredRecording object for storedRecording API responses.
 *
 *  @class StoredRecording
 *  @constructor
 *  @extends Resource
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to the instance
 */
class StoredRecording extends Resource {
  /**
   *  The name of the identifier field used when passing as parameter.
   *
   *  @member {string} _param
   *  @memberof module:resources~StoredRecording
   */
  _param = 'recordingName';
  /**
   *  The name of this resource.
   *
   *  @member {string} _resource
   *  @memberof module:resources~StoredRecording
   */
  _resource = 'recordings';

  constructor (client, id, objValues) {
    Resource.call(this, client, id, objValues);
  }

  /**
   *  Get or set id for the storedRecording.
   *
   *  @method _id
   *  @memberof module:resources~StoredRecording
   *  @param {string} value - value to assign to the id property
   */
  _id(value) {
    if (value) {
      this.name = value;
    } else {
      return this.name;
    }
  };
}

/**
 *  Attach operations to the resource instance bound to this.
 *
 *  @method attachOperations
 *  @memberof module:resources
 *  @this module:resources~Resource
 *  @private
 */
class AttachOperations {
  params;
  multi;
  respType;

  constructor() {
    /*jshint validthis:true*/
    const operations = this._client._swagger.apis[this._resource].operations;

    _.each(_.keys(operations), this.#attachOperation);
  }


  /**
   *  Attach operation to resource instance.
   *
   *  @callback attachOperationsCallback
   *  @memberof module:resources~attachOperations
   *  @method attachOperation
   *  @private
   *  @param {string} operation - the operation to attach
   */
  #attachOperation (operation) {
    this[operation] = this.#callSwagger;

    const oper = this._client._swagger.apis[this._resource].operations[operation];
    this.respType = oper.type;
    this.multi = false;
    const regexArr = swaggerListTypeRegex.exec(this.respType);
    if (regexArr !== null) {
      this.respType = regexArr[1];
      this.multi = true;
    }
    this.params = oper.parameters;
  }

  /**
   *  Responsible for calling API through Swagger.
   *
   *  @callback attachOperationCallback
   *  @memberof module:resources~attachOperations~attachOperation
   *  @method callSwagger
   *  @private
   *  @param {Object} parameters - parameters to swagger
   *  @param {Resource} [createInstance] - instance to get identifier from for
   *    purposes of creating the resource through ARI
   *  @param {Function} callback - callback invoked with swagger response
   */
  #callSwagger (/*args..., callback */) {
    // Separate user callback from other args and inject object id(s)
    // if appropriate
    let args = _.toArray(arguments);
    let options = _.first(args);
    const createInstance = args[1];
    const userCallback = (_.isFunction(_.last(args))) ? _.last(args)
                                                      : undefined;

    return new Promise((resolve, reject) => {
      args = [];

      if (options === undefined || options === null ||
          _.isFunction(options) || _.isArray(options)) {
        options = {};
      } else {
        // Swagger can alter options passed in
        options = _.clone(options);
        // convert body params for swagger
        options = _utils.parseBodyParams(this.params, options);
      }

      _.each(this.params, function (param) {
        const expectedParam = param.name;
        let actualParam = this._param;

        if (_.isArray(actualParam)) {
          actualParam = _.find(actualParam, function (candidate) {
            return candidate === expectedParam;
          });
        }

        // Inject parameter using instance value
        if (expectedParam === actualParam && param.required) {
          const identifier = this._id() || '';
          // In case of multi ids
          options[expectedParam] = identifier[expectedParam] || identifier;
        }
      });

      // Inject create method parameters if instance has client
      // generated id.
      if (_.includes(_.keys(this._createMethods), operation)) {
        const createMethod = this._createMethods[operation];
        if (createMethod.requiresInstance) {
          // Extract parameter from instance parameter
          if (createInstance instanceof Resource &&
              createInstance._generatedId) {

            options[createMethod.param] = createInstance._id();
          }
        } else if (this._generatedId) {
          options[createMethod.param] = this._id();
        }
      }


      args.push(options);
      // Inject response processing callback
      args.push(resolve(this.#processResponse));
      // Inject error handling callback
      args.push(reject(this.#swaggerError));

      // Run operation against swagger
      this._client._swagger.apis[this._resource][operation].apply(
        null,
        args
      );
    })//.asCallback(userCallback);
  }

  /**
   *  Process response from Swagger.
   *
   *  @callback callSwaggerSuccessCallback
   *  @method processResponse
   *  @memberof
   *    module:resources~attachOperations~attachOperation~callSwagger
   *  @private
   *  @param {Object} response - response from swagger
   */
  #processResponse(response) {
    let result;

    if (this.respType === 'binary') {
      result = Buffer.from(response.data);
    } else {
      result = response.data.toString('utf-8');
      if (this.respType !== null && result) {
        result = JSON.parse(result);
      }
    }

    if (_.includes(knownTypes, this.respType) &&
        module.exports[this.respType] !== undefined) {

      if (this.multi) {
        result = _.map(result, function (obj) {
          return module.exports[this.respType](
            this._client,
            obj
          );
        });
      } else {
        result = module.exports[this.respType](
          this._client,
          result
        );
      }
    }

    return result
  }

  /**
   *  Handle error from Swagger.
   *
   *  @callback callSwaggerErrorCallback
   *  @method swaggerError
   *  @memberof
   *    module:resources~attachOperations~attachOperation~callSwagger
   *  @private
   *  @param {Error} err - error object
   */
  #swaggerError (err) {
    if (err && err.data) {
      err = new Error(err.data.toString('utf-8'));
    }

    return err
  }
}

/**
 *  The known resource types.
 *
 *  @member {string[]} knownTypes
 *  @memberof module:resources
 */
module.exports.knownTypes = knownTypes;

/**
 *  Regex used to determine if return type is a list of a known resource type.
 *
 *  @member {Regex} swaggerListTypeRegex
 *  @memberof module:resources
 */
module.exports.swaggerListTypeRegex = swaggerListTypeRegex;

/**
 *  Creates a new Application instance.
 *
 *  @memberof module:resources
 *  @method Application
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Application} application
 */
module.exports.Application = function (client, id, objValues) {
  const application = new Application(client, id, objValues);
  AttachOperations.call(application);
  return application;
};

/**
 * Creates a new Asterisk resource.
 *
 * @memberof module:resources
 * @method Asterisk
 * @param {Client} client - ARI client instance
 * @param {Object} objValues - ownProperties to copy to instance
 * @returns {module:resources~Asterisk} asterisk resource
 */
module.exports.Asterisk = function (client, objValues) {
  const asterisk = new Asterisk(client, objValues);
  AttachOperations.call(asterisk);
  return asterisk;
};

/**
 *  Creates a new Bridge instance.
 *
 *  @memberof module:resources
 *  @method Bridge
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Bridge} bridge
 */
module.exports.Bridge = function (client, id, objValues) {
  const bridge = new Bridge(client, id, objValues);
  AttachOperations.call(bridge);
  return bridge;
};

/**
 *  Creates a new Channel instance.
 *
 *  @memberof module:resources
 *  @method Channel
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Channel} channel
 */
module.exports.Channel = function (client, id, objValues) {
  const channel = new Channel(client, id, objValues);
  AttachOperations.call(channel);
  return channel;
};

/**
 *  Creates a new DeviceState instance.
 *
 *  @memberof module:resources
 *  @method DeviceState
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~DeviceState} deviceState
 */
module.exports.DeviceState = function (client, id, objValues) {
  const deviceState = new DeviceState(client, id, objValues);
  AttachOperations.call(deviceState);
  return deviceState;
};

/**
 *  Creates a new Endpoint instance.
 *
 *  @memberof module:resources
 *  @method Endpoint
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Endpoint} endpoint
 */
module.exports.Endpoint = function (client, id, objValues) {
  const endpoint = new Endpoint(client, id, objValues);
  AttachOperations.call(endpoint);
  return endpoint;
};

/**
 *  Creates a new LiveRecording instance.
 *
 *  @memberof module:resources
 *  @method LiveRecording
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~LiveRecording} liveRecording
 */
module.exports.LiveRecording = function (client, id, objValues) {
  const liveRecording = new LiveRecording(client, id, objValues);
  AttachOperations.call(liveRecording);
  return liveRecording;
};

/**
 *  Creates a new Mailbox instance.
 *
 *  @memberof module:resources
 *  @method Mailbox
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Mailbox} mailbox
 */
module.exports.Mailbox = function (client, id, objValues) {
  const mailbox = new Mailbox(client, id, objValues);
  AttachOperations.call(mailbox);
  return mailbox;
};

/**
 *  Creates a new Playback instance.
 *
 *  @memberof module:resources
 *  @method Playback
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Playback} playback
 */
module.exports.Playback = function (client, id, objValues) {
  const playback = new Playback(client, id, objValues);
  AttachOperations.call(playback);
  return playback;
};

/**
 *  Creates a new Sound instance.
 *
 *  @memberof module:resources
 *  @method Sound
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~Sound} sound
 */
module.exports.Sound = function (client, id, objValues) {
  const sound = new Sound(client, id, objValues);
  AttachOperations.call(sound);
  return sound;
};

/**
 *  Creates a new StoredRecording instance.
 *
 *  @memberof module:resources
 *  @method StoredRecording
 *  @param {Client} client - ARI client instance
 *  @param {string} id - Application identifier
 *  @param {Object} objValues - ownProperties to copy to instance
 *  @returns {module:resources~StoredRecording} storedRecording
 */
module.exports.StoredRecording = function (client, id, objValues) {
  const storedRecording = new StoredRecording(client, id, objValues);
  AttachOperations.call(storedRecording);
  return storedRecording;
};
