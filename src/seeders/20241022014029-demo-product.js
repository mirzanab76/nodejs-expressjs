'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const products = [];

    for (let i = 0; i < 30; i++) { // Ubah angka 100 dengan jumlah yang Anda inginkan
      products.push({
        product_name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({min: 10000, max: 1000000, dec: 0}),
        category_id: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  }
};
