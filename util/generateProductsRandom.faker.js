const faker = require("faker");

module.exports = () => {
  const products = [];
  for (let i = 0; i < 5; i++) {
    products.push({
      title: faker.commerce.product(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    });
  }
  return products;
};
