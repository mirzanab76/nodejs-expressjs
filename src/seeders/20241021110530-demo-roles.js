'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { role_name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'User', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'Manager', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
