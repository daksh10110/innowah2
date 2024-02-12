const { sequelize } = require("../utils/db");
const Person = require("./person");
const PersonType = require("./personType");

// Define relationships
Person.belongsTo(PersonType, { foreignKey: "person_type_id" });

module.exports = {
    sequelize,
    Person,
    PersonType,
};
