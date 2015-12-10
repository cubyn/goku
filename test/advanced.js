describe('classes', function() {

    class Shipper {
        constructor(name, password = 'pass', siblings = [], sports) {
            this.name = name;
            this.password = password;
            this.siblings = siblings;
            this.sports = sports;
        }
    }

    class Sport {
        constructor(name) {
            this.name = name;
        }
    }

    // sample data
    var sports = [
        new Sport('squash'),
        new Sport('basket')
    ];
    var sis = new Shipper('sis');
    var bro = new Shipper('bro');
    var child = new Shipper('name', 'pass', [sis, bro], sports);

    it('should handle described classes', function () {
        var descriptors = {
            Shipper: {
                name: true,
                siblings: true
            }
        };
        expectSerialize(new Shipper('name', 'pass'), descriptors)
            .to.deep.equal({
                name: 'name',
                siblings: []
            });

        expectSerialize(new Shipper('name', 'pass', [sis, bro]), descriptors)
            .to.deep.equal({
                name: 'name',
                siblings: [{
                    name: 'sis',
                    siblings: []
                }, {
                    name: 'bro',
                    siblings: []
                }]
            });
    });

    it('should handle serialization groups', function () {

        expectSerialize(child, {
                Shipper: {
                    name: true,
                    siblings: [ 'details' ]
                }
            })
            .to.deep.equal({ name: 'name' });

        expectSerialize(child, {
                Shipper: {
                    name: true,
                    siblings: [ 'details' ]
                }
            }, [ 'details' ])
            .to.deep.equal({
                name: 'name',
                siblings: [{
                    name: 'sis',
                    siblings: []
                }, {
                    name: 'bro',
                    siblings: []
                }]
            });
    });

    it('should handle depths', function () {

        expectSerialize(child, {
                Shipper: {
                    name: true,
                    siblings: [ 'details' ],
                    sports: [ 'sports' ]
                }
            }, [ 'details', 'sports' ])
            .to.deep.equal({
                name: 'name',
                siblings: [{
                        name: 'sis',
                        siblings: []
                    }, {
                        name: 'bro',
                        siblings: []
                    }],
                sports: [{
                        name: 'squash'
                    }, {
                        name: 'basket'
                    }]
            });
    });

    it('should handle recursion', function () {

        var a = { id: "a" };
        var b = { id: "b" };
        a.brother = b;
        b.brother = a;

        expectSerialize(a, {}, [], { maxDepth: 3, maxDepthWarning: '---' })
            .to.deep.equal({
                id: "a",
                brother: {
                    id: "b",
                    brother: {
                        id: "a",
                        // not any further because max depth is 3
                        brother: '---'
                    }
                }
            });
    });

    it('should handle aliases', function () {

        expectSerialize(child, {
                Shipper: {
                    name: { as: 'appellation' },
                    siblings: [ 'details' ],
                    sports: {
                        as: 'activities',
                        groups: [ 'details' ]
                    }
                },
            })
            .to.deep.equal({
                appellation: 'name'
            });

        expectSerialize(child, {
                    Shipper: {
                        name: { as: 'appellation' },
                        siblings: [ 'details' ],
                        sports: {
                            as: 'activities',
                            groups: [ 'details' ]
                        }
                    },
                },
                [ 'details' ]
            )
            .to.deep.equal({
                appellation: 'name',
                siblings: [{
                        appellation: 'sis',
                        siblings: []
                    }, {
                        appellation: 'bro',
                        siblings: []
                    }],
                activities: [{
                        name: 'squash'
                    }, {
                        name: 'basket'
                    }]
            });
    });
});
