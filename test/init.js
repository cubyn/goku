import chai from 'chai';
import Goku from '../src/Goku';

global.expect = chai.expect;

global.expectSerialize = function(data, descriptors = {}, serializationGroups = [], options) {
    var s = new Goku(descriptors, options);
    return expect(s.serialize(data, serializationGroups));
}
