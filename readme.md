# JSON API Converter

A javascript library for converting your data to [JSON
API](http://jsonapi.org) (1.0 compliant).

## Installation
`yarn add jsonapi-converter`

## Documentation

### Converting data to JSON API
```javascript
const jsonApiConverter = require('jsonapi-converter');
const userConverter = new jsonApiConverter('users', {
  attributes: ['name', 'email']
});
```

The constructor `jsonApiConverter` takes two arguments:
- `type`: The resource type.
- `options`: The converting options.

Calling the `convert` method on the returned object will convert your `data` (object or array) to a compliant JSONAPI document.

#### Available options
- `attributes`: An array of attributes to show in your resource
- `idKey`: key of 'id' in your resource (by default it 'id' or '_id')
- another resources (structure is fractaling)

### Examples

```javascript
const jsonApiConverter = require('jsonapi-converter');
const userConverter = new jsonApiConverter('users', {
  attributes: ['name', 'email']
});

const data = {
  id: 1,
  name: 'John',
  email: 'john@mail.com',
  password: 'qwe123'
};

const result = userConverter.convert(data);
```

The result will be something like:

```javascript
{
  data: {
    type: 'users',
    id: 1,
    attributes: {
      name: 'John',
      email: 'john@mail.com'
    }
  }
}
```

Converting with relationships:
```javascript
const jsonApiConverter = require('jsonapi-converter');
const userConverter = new jsonApiConverter('users', {
  meta: {
    count: 2
  }
  attributes: ['name', 'email'],
  address: {
    idKey: 'key'
    attributes: ['city']
  }
});

const data = [
  {
    id: 1,
    name: 'John',
    email: 'john@mail.com',
    password: 'qwe123',
    address: {
      key: 23,
      city: 'Moscow',
      street: 'Lenina'
    }
  },
  {
    id: 2,
    name: 'Kate',
    email: 'kate@mail.com',
    password: 'asd123',
    address: {
      key: 54,
      city: 'London',
      street: 'Baker st'
    }
  }
];

const result = userConverter.convert(data);
```

The result will be something like:

```javascript
{
  meta: {
    count: 2
  },
  data: [
    {
      type: 'users',
      id: 1,
      attributes: {
        name: 'John',
        email: 'john@mail.com'
      },
      relationships: {
        address: {
          data: {
            type: 'address',
            id: 23,
            attributes: {
              city: 'Moscow'
            }
          }
        }
      }
    },
    {
      type: 'users',
      id: 2,
      attributes: {
        name: 'Kate',
        email: 'kate@mail.com'
      },
      relationships: {
        address: {
          data: {
            type: 'address',
            id: 54,
            attributes: {
              city: 'London'
            }
          }
        }
      }
    }
  ]
}
```

[See more examples in tests](https://github.com/kirillurgant/jsonapi-converter/blob/master/tests/index.test.js)