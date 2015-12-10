describe('raw data', function() {

    it('should handle primitives', function() {
        expectSerialize(null)
            .to.be.undefined;
        expectSerialize(true)
            .to.be.true;
        expectSerialize(false)
            .to.be.false;
        expectSerialize('a')
            .to.equal('a');
        expectSerialize({})
            .to.deep.equal({});
        expectSerialize([1, 2, 3])
            .to.deep.equal([1, 2, 3]);
        expectSerialize({ a: null, b: 1 })
            .to.deep.equal({ b: 1 });
    });

    it('should handle functions', function() {
        var fn = function() {};
        fn.a = 1;
        expectSerialize(fn)
            .to.deep.equal({
                a: 1
            });
        fn.sub = function() {};
        expectSerialize(fn)
            .to.deep.equal({
                a: 1
            });

        var Fn = function() {};
        Fn.prototype.method = function() {};
        var f = new Fn();
        f.a = function() {};
        expectSerialize(f)
            .to.deep.equal({});
    });

    it('should handle objects', function() {
        expectSerialize({ a: 'test' })
            .to.deep.equal({ a: 'test' });
        expectSerialize({ a: 'test', b: { c: 1 } })
            .to.deep.equal({ a: 'test', b: { c: 1 } });
    });

});
