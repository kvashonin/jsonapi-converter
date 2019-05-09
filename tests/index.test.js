const { Converter } = require('../index');
const posts = require('./mock/posts.json');

describe('serializing some data', () => {
  it('should throw error on empty resource type', () => {
    expect(() => new Converter()).toThrow();
  });

  it('should throw error on incorrect serializing data', () => {
    expect(() => new Converter('resource').convert('string')).toThrow();
  });

  it('should return default data', () => {
    const someConverter = new Converter('resource');
    const result = someConverter.convert({
      id: 1,
      name: 'John',
      age: 18,
    });

    expect(result.data).toBeDefined();
    expect(result.meta).toBeUndefined();
  });

  // it('should throw error', () => {
  //   const postsConverter = new Converter('posts', {
  //     attributes: ['title', 'body'],
  //   });
  // });
});
