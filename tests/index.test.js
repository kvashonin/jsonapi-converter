const { isEmpty } = require('ramda');
const { Converter } = require('../index');
const { generateBySchema, generateArrayBySchema } = require('./faker');

describe('serializing some data', () => {
  it('should throw error on empty resource type', () => {
    expect(() => new Converter()).toThrow();
  });

  it('should throw error on incorrect serializing data', () => {
    expect(() => new Converter('type').convert('string')).toThrow();
  });

  it('should return empty data object', () => {
    const someConverter = new Converter('type');
    const result = someConverter.convert();

    expect(isEmpty(result.data)).toBeTruthy();
  });

  it('document shouldn\'t contain meta and resource shouldn\'t contain attributes', () => {
    const someConverter = new Converter('resource');
    const result = someConverter.convert({
      id: 1,
      name: 'John',
      age: 18,
    });

    expect(result.data.type).toBeDefined();
    expect(result.data.id).toBeDefined();
    expect(result.data.attributes).toBeUndefined();
    expect(result.meta).toBeUndefined();
  });

  it('document should contain meta', () => {
    const someConverter = new Converter('resource', {
      meta: { count: 1 },
    });
    const result = someConverter.convert({ id: 1 });

    expect(result.data.type).toBeDefined();
    expect(result.data.id).toBeDefined();
    expect(result.data.attributes).toBeUndefined();
    expect(result.meta).toBeDefined();
  });

  it('resource should contain attributes', () => {
    const userConverter = new Converter('users', {
      attributes: ['name', 'email'],
    });
    const result = userConverter.convert(generateBySchema());

    expect(result.data.type).toBeDefined();
    expect(result.data.id).toBeDefined();
    expect(result.data.attributes.name).toBeDefined();
    expect(result.data.attributes.email).toBeDefined();
    expect(result.data.attributes.phone).toBeUndefined();
    expect(result.meta).toBeUndefined();
  });

  it('resource should contain relationships', () => {
    const userConverter = new Converter('users', {
      attributes: ['name', 'email', 'phone'],
      address: {
        attributes: ['city', 'streetName'],
      },
    });
    const result = userConverter.convert(generateBySchema());

    expect(result.meta).toBeUndefined();
    expect(result.data.type).toBeDefined();
    expect(result.data.id).toBeDefined();
    expect(result.data.attributes.name).toBeDefined();
    expect(result.data.attributes.email).toBeDefined();
    expect(result.data.attributes.phone).toBeDefined();
    expect(result.data.relationships.address.data.type).toBeDefined();
    expect(result.data.relationships.address.data.id).toBeDefined();
    expect(result.data.relationships.address.data.attributes.city).toBeDefined();
    expect(result.data.relationships.address.data.attributes.streetName).toBeDefined();
  });

  it('document should contain 10 data items', () => {
    const userConverter = new Converter('users', {
      attributes: ['name', 'email', 'phone'],
      address: {
        attributes: ['city', 'streetName'],
      },
    });
    const result = userConverter.convert(generateArrayBySchema(10));

    for (let i = 0; i < 10; i += 1) {
      expect(result.meta).toBeUndefined();
      expect(result.data[i].type).toBeDefined();
      expect(result.data[i].id).toBeDefined();
      expect(result.data[i].attributes.name).toBeDefined();
      expect(result.data[i].attributes.email).toBeDefined();
      expect(result.data[i].attributes.phone).toBeDefined();
      expect(result.data[i].relationships.address.data.type).toBeDefined();
      expect(result.data[i].relationships.address.data.id).toBeDefined();
      expect(result.data[i].relationships.address.data.attributes.city).toBeDefined();
      expect(result.data[i].relationships.address.data.attributes.streetName).toBeDefined();
    }
  });
});
