const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];

    for (let i = 0; i < 100; i++) {
      users.push({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 10),
        address: faker.location.streetAddress(),
        age: Math.floor(Math.random() * (65 - 18 + 1)) + 18,
        role_id: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
