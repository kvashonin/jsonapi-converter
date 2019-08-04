/* eslint-disable no-underscore-dangle */
const {
  omit, pick, is, isEmpty, keys,
} = require('ramda');

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
    this.convert = this.getDocument;
  }

  getResource(data, type, options) {
    if (!data || !type) return null;

    const id = options.idKey ? data[options.idKey] : (data.id || data._id);

    const result = {
      id,
      type,
    };

    const { attributes } = options;
    if (attributes && attributes.length) result.attributes = pick(attributes, data);

    const relationships = omit(this.reservedOptionKeys, options);
    if (!isEmpty(relationships)) {
      const resultRelationships = keys(relationships).reduce((acc, resourceKey) => {
        const dataItem = data[resourceKey];
        if (dataItem) {
          acc[resourceKey] = this.getDocument(dataItem, resourceKey, relationships[resourceKey]);
        }

        return acc;
      }, {});

      if (!isEmpty(resultRelationships)) result.relationships = resultRelationships;
    }

    return result;
  }

  getDocument(data, type = this.type, options = this.options) {
    const result = {
      data: {},
    };

    if (!data || !type) return result;

    if (options.meta) result.meta = options.meta;

    if (Array.isArray(data)) {
      result.data = data.map(dataItem => this.getResource(dataItem, type, options));
    } else if (is(Object, data)) {
      result.data = this.getResource(data, type, options);
    } else {
      throw new Error('Incorrect serializing data!');
    }

    return result;
  }
}

module.exports = Converter;
