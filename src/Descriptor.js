import FieldDescriptor from './FieldDescriptor';

/**
 * Holds configuration for that class' serialization
 */
export default class Descriptor {

    constructor(name) {
        this.name = name;
        this.fields = {};
    }

    static parse(name, data) {
        const descriptor = new Descriptor(name);
        for (var fieldName in data) {
            const fieldData = data[fieldName];
            descriptor.fields[fieldName] = FieldDescriptor.parse(fieldName, fieldData);
        }
        return descriptor;

    }

}
