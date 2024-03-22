const { sequelize } = require("../utils/db");
const Person = require("./Person");
const Chat = require("./Chat");
const Investment = require("./Investment");
const InvestmentRelationship = require("./InvestmentRelationship");


Chat.belongsTo(Person, { as: "Sender", foreignKey: "senderId" });
Chat.belongsTo(Person, { as: "Receiver", foreignKey: "receiverId" });

// Synchronize models with the database
sequelize.sync({ force: false });

module.exports = {
    sequelize,
    Person,
    Chat,
    Investment,
    InvestmentRelationship,
};
