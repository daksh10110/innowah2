const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const Person = require("./Person");

class Investment extends Model {
  // Add any specific methods or validations here
}

Investment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    investmentAmountNeeded: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    investmentAmountAcquired: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    otherInvestors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    expectedReturns: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minimumInvestment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    listingType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastDateToInvest: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "Investment",
  }
);

// Define associations
Investment.belongsToMany(Person, { through: "InvestmentRelationship" });

(async () => {
  try {
    await Investment.sync({ alter: true });
    console.log("Investment model is synced with the database");
  } catch (error) {
    console.error("Error syncing the Investment model:", error);
  }
})();

module.exports = Investment;
