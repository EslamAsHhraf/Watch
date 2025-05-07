const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const BlacklistedToken = sequelize.define(
    "BlacklistedToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      updatedAt: false, // We don't need updatedAt for this model
    }
  );

  // Class method to check if a token is blacklisted
  BlacklistedToken.isBlacklisted = async function (token) {
    const blacklistedToken = await this.findOne({ where: { token } });
    return !!blacklistedToken;
  };

  // Setup periodic cleanup of expired tokens
  // This could be called via a cron job or similar scheduled task
  BlacklistedToken.cleanupExpiredTokens = async function () {
    const now = new Date();
    await this.destroy({
      where: {
        expiresAt: {
          [sequelize.Op.lt]: now,
        },
      },
    });
  };

  return BlacklistedToken;
};