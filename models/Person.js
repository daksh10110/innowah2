const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const { ulid } = require("ulid");

class Person extends Model {}

Person.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: ulid,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pan: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: "Person",
    },
);

// Synchronize the model with the database (Creates the table if it doesn't exist)
(async () => {
    try {
        await Person.sync({ alter: true });
        console.log("Person model is synced with the database");
    } catch (error) {
        console.error("Error syncing the Person model:", error);
    }
})();

module.exports = Person;
