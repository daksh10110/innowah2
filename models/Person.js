const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const bcrypt = require("bcrypt");

class Person extends Model {
    comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

Person.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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
        type: {
            type: DataTypes.ENUM("investor", "investee"),
            allowNull: false,
        },
        fcmID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: "Person",
    },
);

Person.prototype.comparePassword = async function (candidatePassword) {
    const res = await bcrypt.compare(candidatePassword, this.password);
    return res;
};


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
