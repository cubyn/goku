# Goku
> Transform & serialize to simple JS objects

Goku takes simple descriptors and transform + serializes complex JS objects into simple JSON objects.

Features:
- recursion
- es6 support (class name based serialization)
- field aliases
- serialization groups

## Sample

```javascript
// descriptor in user-descriptor.json
{
    // aliases
    number: { as: 'id' },
    // always serialized
    firstName: true,
    lastName: true,
    // not serialized by default
    email: [ 'details' ],
    createdAt: [ 'details' ],
    children: [ 'details' ]
};

const user = new User({
    number: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@doe.com',
    createdAt: new Date(),
    children: [ child1, child2 ]
});

goku.serialize(user);
// --› {
//      id: 1,
//      firstName: 'Jane',
//      lastName: 'Doe'
//  }

goku.serialize(user, ['details']);
// --› {
//      id: 1,
//      firstName: 'Jane',
//      lastName: 'Doe',
//      email: 'jane@doe.com',
//      createdAt: [ Date ],
//      children: [
//          {...},
//          {...}
//      ]
//  }
```

## Defining and registering your descriptors

```json
// in user-descriptor.json
{
    "firstName": true,
    "lastName": true,
    "email": [ "details" ]
}
```

```javascript
import Goku from 'goku';
const goku = new Goku();
goku.registerDescriptor('User', require('user-descriptor.json'));
goku.serialize(user);
```

## Using in an ES6 project

```javascript
require('babel/register')({
    stage: 1,
    ignore: /node_modules\/(?!goku)/
})
```

## Contributions

```
gulp watch
gulp test

# this module is written in ES6 - so it has to be transpiled
# before being published to NPM

npm publish
```
