'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BlacklistedTokens', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('BlacklistedTokens', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  }
};
