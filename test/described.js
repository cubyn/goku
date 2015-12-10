describe('described data', function() {

    class DescribedShipper {
        constructor(name, password = 'pass', siblings = [], sports) {
            this.name = name;
            this.password = password;
            this.siblings = siblings;
            this.sports = sports;
        }
        getSerializationName() {
            return 'DescribedPeople';
        }
        toJSON() {
            const jsonSports = this.sports ?
                this.sports.map((s) => s.toJSON()) :
                null;
            return {
                name: this.name,
                siblings: this.siblings,
                sports: jsonSports
            };
        }
    }

    class DescribedSport {
        constructor(name, playerCount = 5) {
            this.name = name;
            this.playerCount = playerCount;
        }
        getSerializationName() {
            return 'DescribedActivity';
        }
        toJSON() {
            return {
                name: this.name,
                playerCount: this.playerCount
            };
        }
    }

    it('should handle toJSON/getSerializationName', function () {

        var shipper = new DescribedShipper('toto');

        expectSerialize(shipper, {
                DescribedPeople: {
                    name: true,
                    siblings: [ 'details' ]
                }
            }, [ 'details' ])
            .to.not.deep.equal({
                name: 'name',
                siblings: []
            });

        var sport = new DescribedSport('squash');
        shipper.sports = [ sport ];

        expectSerialize(shipper, {
                DescribedPeople: {
                    name: true,
                    siblings: [ 'details' ],
                    sports: [ 'details' ]
                },
                DescribedActivity: {
                    name: true
                }
            }, [ 'details' ])
            .to.deep.equal({
                name: 'toto',
                siblings: [],
                sports: [{
                    name: 'squash'
                }]
            });
    });
});
