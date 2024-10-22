'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { category_name: 'Electronic', createdAt: new Date(), updatedAt: new Date() },
      { category_name: 'Food', createdAt: new Date(), updatedAt: new Date() },
      { category_name: 'Furniture', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
