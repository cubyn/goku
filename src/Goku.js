import _ from 'lodash';
import Context from './Context';
import Descriptor from './Descriptor';

const debug = require('debug')('goku');

const DEFAULT_OPTIONS = {
    maxDepth: 5,
    maxDepthWarning: '@MAX_DEPTH@'
};

/**
 * Serialize objects given descriptors previously registered
 * thru `constructor` or `registerDescriptor`
 */
export default class Goku {

    /**
     * @param  {Object} descriptors A map of descriptors
     * @param  {Object} options
     */
    constructor(descriptors = {}, options = {}) {
        this.options = {
            maxDepth: options.maxDepth || DEFAULT_OPTIONS.maxDepth,
            maxDepthWarning: options.maxDepthWarning || DEFAULT_OPTIONS.maxDepthWarning
        };
        this.descriptors = {};
        var name;
        for (name in descriptors) {
            this.registerDescriptor(name, descriptors[name]);
        }
    }

    /**
     * @param  {mixed}         data
     * @param  {Array}         groups (optional) serialization groups
     * @param  {String}        serName (optional) The serializer to use for depth === 0
     * @return {Object}        The serialization result as a raw JS object
     */
    serialize(data, groups = [], serName) {
        if (serName && data) {
            const getSerializationName = _.identity(serName);

            if (Array.isArray(data)) {
                data = data.map(d => Object.assign(d, { getSerializationName }));
            } else {
                data.getSerializationName = getSerializationName;
            }
        }

        var result = this._doSerialize(data, new Context(groups || []));
        if (_.isObject(data) && _.isUndefined(result)) {
            return {};
        }
        return result;
    }

    /**
     * @param  {String} name
     * @return {Descriptor}
     */
    getDescriptor(name) {
        if (name && this.descriptors[name]) {
            return this.descriptors[name];
        }

        return null;
    }

    /**
     * Parse and register that descriptor
     * @param  {String} classname  [description]
     * @param  {Object} descriptor [description]
     */
    registerDescriptor(classname, descriptor) {
        debug(`Registered ${classname} descriptor`);
        this.descriptors[classname] = Descriptor.parse(classname, descriptor);
    }

    _doSerialize(data, context) {
        // incr depth
        context = context.incrDepthClone();

        // do not serialize null values
        if (_.isUndefined(data) || _.isNull(data)) {
            return undefined;
        }

        if (_.isBoolean(data) || _.isString(data) || _.isNumber(data) || _.isDate(data)) {
            return data;
        }

        if (context.depth > this.options.maxDepth) {
            return this.options.maxDepthWarning;
        }

        if (_.isArray(data)) {
            return _.map(data, (o) => {
                return this._doSerialize(o, context);
            });
        }

        if (_.isObject(data)) {
            var serName = this.getSerializationName(data);
            var descriptor = this.getDescriptor(serName);
            var serializedObject;
            if (descriptor) {
                debug(`Serializing ${serName} with groups ${context.groups.join(',')}`);
                serializedObject = this._doSerializeObject(data, descriptor, context);
            } else {
                var result = compact(_.mapValues(data, (o, k) => {
                    return this._doSerialize(o, context);
                }));
                if (_.isEmpty(result)) return undefined;
                serializedObject = result;
            }
            return serializedObject;
        }

        return undefined;
    }

    _doSerializeObject(object, descriptor, context) {
        var result = {};
        var raw = object;
        if (_.isFunction(object.toJSON)) {
            raw = object.toJSON();
        }
        for (var key in descriptor.fields) {
            var fieldDescriptor = descriptor.fields[key];
            var serializeIt = fieldDescriptor.always
                || !!_.intersection(fieldDescriptor.groups, context.groups).length;
            var sub;
            if (key in object) sub = object[key];
            else sub = raw[key];
            if (serializeIt && !_.isUndefined(sub)) {
                result[fieldDescriptor.as] = this._doSerialize(sub, context);
            }
        }
        return compact(result);
    }

    getSerializationName(object) {
        var serName = null;
        if (!_.isObject(object)) return null;
        if (_.isFunction(object.getSerializationName)) {
            serName = object.getSerializationName();
        } else if (object.constructor && object.constructor.name !== 'Function') {
            serName = object.constructor.name;
        } else {
            serName = object.name;
        }
        return serName;
    }
}

function compact(o) {
    for (var k in o) {
        if (o[k] === undefined) {
            delete o[k];
        }
    }
    return o;
}
