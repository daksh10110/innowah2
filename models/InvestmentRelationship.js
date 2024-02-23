const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class InvestmentRelationship extends Model {}

InvestmentRelationship.init(
  {
    investorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    investeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    investmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    investmentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "InvestmentRelationship",
  }
);

(async () => {
  try {
    await InvestmentRelationship.sync({ alter: true });
    console.log("Investment model is synced with the database");
  } catch (error) {
    console.error("Error syncing the Investment model:", error);
  }
})();

module.exports = InvestmentRelationship;
