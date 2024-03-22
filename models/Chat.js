const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class Chat extends Model {}

Chat.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "people", key: "id" },
            field: "receiver_id"
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "people", key: "id" },
            field: "sender_id" // Explicitly specifying the database field name
        },
        
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: "Chat",
    },
);

// Synchronize the model with the database (Creates the table if it doesn't exist)
(async () => {
    try {
        await Chat.sync({ alter: true });
        console.log("Chat model is synced with the database");
    } catch (error) {
        console.error("Error syncing the Chat model:", error);
    }
})();

module.exports = Chat;
