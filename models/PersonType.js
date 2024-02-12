const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const { ulid } = require("ulid");

class PersonType extends Model {}

PersonType.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: ulid,
        },
        typeName: {
            type: DataTypes.ENUM("investor", "investee"),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: "PersonType",
    }
);