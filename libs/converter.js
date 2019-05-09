const { omit, pick, mapObjIndexed } = require('ramda');

const reservedOptionKeys = [
  'attributes',
  'meta',
  'idKey',
];

class Converter {
  constructor(type, options = {}) {
    if (!type) throw new Error('Type of resource is empty!');

    this.type = type;
    this.options = options;
    this.reservedOptionKeys = reservedOptionKeys;
  }

  static isObject(data) {
    return (typeof data === 'object' || data instanceof Object);
  }

  convert(data, type = this.type, options = this.options) {
    if (!data) throw new Error('Serializing data is empty!');

    const result = {};

    const resources = omit(this.reservedOptionKeys, options);

    if (options.meta) result.meta = options.meta;

    if (this.isObject(data)) {
      result.data = {
        // eslint-disable-next-line no-underscore-dangle
        id: options.idKey ? data[options.idKey] : (data.id || data._id),
        type,
        attributes: mapObjIndexed((dataItem, dataItemKey) => {
          const resource = resources[dataItemKey];

          if (resource) return this.convert(dataItem, dataItemKey, resource);

          return dataItem;
        }, pick(options.attributes, data)),
      };
    } else if (Array.isArray(data)) {
      result.data = data.map(dataItem => this.convert(dataItem, type, options));
    } else {
      throw new Error('Incorrect serializing data!');
    }

    return result;
  }
}

module.exports = Converter;
