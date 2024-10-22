'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'picture', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles', // Nama tabel yang jadi referensi
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'name');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'age');
    await queryInterface.removeColumn('Users', 'picture');
    await queryInterface.removeColumn('Users', 'role_id');
  }
};
