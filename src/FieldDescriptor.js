import _ from 'lodash';

/**
 * Holds configuration for that field serialization
 */
export default class FieldDescriptor {

    constructor(name, always = true, groups = [], as = null) {
        this.name = name;
        this.always = always;
        this.groups = groups;
        if (!as) as = name;
        this.as = as;
    }

    static parse(name, data) {
        if (_.isBoolean(data)) {
            return new FieldDescriptor(name, data);
        } else if (_.isArray(data)) {
            return new FieldDescriptor(name, false, data);
        } else if (_.isObject(data)) {
            const isEmpty = data.groups && data.groups.length === 0;
            const always = _.isBoolean(data.always) ? data.always : isEmpty;
            return new FieldDescriptor(name, always, data.groups || [], data.as);
        }

        throw new Error('Was not able to parse provided parameters.');
    }

}
