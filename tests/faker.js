const faker = require('faker');
const { is } = require('ramda');

const userSchema = {
  id: '{{random.number}}',
  name: '{{company.companyName}} {{company.companySuffix}}',
  phone: '{{phone.phoneNumber}}',
  email: '{{internet.email}}',
  address: {
    id: '{{random.number}}',
    city: '{{address.city}}',
    streetName: '{{address.streetName}}',
    streetAddress: '{{address.streetAddress}}',
  },
};

const generateBySchema = (schema = userSchema) => Object.keys(schema).reduce((acc, schemaKey) => {
  const itemSchema = schema[schemaKey];
  if (is(Object, itemSchema)) {
    acc[schemaKey] = generateBySchema(itemSchema);
  } else {
    acc[schemaKey] = faker.fake(schema[schemaKey]);
  }

  return acc;
}, {});

const generateArrayBySchema = (count, schema) => Array.from({ length: count })
  .map(() => generateBySchema(schema));

module.exports = {
  generateBySchema,
  generateArrayBySchema,
};
