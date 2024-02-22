const { sequelize } = require("../utils/db");
const Person = require("./Person");
const Chat = require("./Chat");

// Define associations
Person.belongsToMany(Person, {
    as: "Sender",
    through: "Chats", // This will create a join table named 'Chats'
    foreignKey: "senderId",
    otherKey: "receiverId"
});

Person.belongsToMany(Person, {
    as: "Receiver",
    through: "Chats", // This will create a join table named 'Chats'
    foreignKey: "receiverId",
    otherKey: "senderId"
});

Chat.belongsTo(Person, { as: "Sender", foreignKey: "senderId" });
Chat.belongsTo(Person, { as: "Receiver", foreignKey: "receiverId" });

// Synchronize models with the database
sequelize.sync({ force: false });

module.exports = { sequelize, Person, Chat };
