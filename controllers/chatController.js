const { Person, Chat } = require("../models");
const { Op } = require("sequelize");

const admin = require("firebase-admin");
const serviceAccount = require("../innowah-f271c-firebase-adminsdk-jam67-e348db5bd9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
  
  
const express = require("express");
const router = express.Router();

// Route to get the list of people the user is communicating with
router.get("/:personId/people", async (req, res) => {
    const { personId } = req.params;

    try {
        // Check if the person exists
        const personExists = await Person.findByPk(personId);
        if (!personExists) {
            return res.status(404).json({ error: "Person not found" });
        }

        // Find all unique contacts by senderId and receiverId
        const sentChats = await Chat.findAll({
            attributes: ["receiverId"],
            where: { senderId: personId },
            group: ["receiverId"]
        });

        const receivedChats = await Chat.findAll({
            attributes: ["senderId"],
            where: { receiverId: personId },
            group: ["senderId"]
        });

        // Combine and deduplicate person IDs
        const distinctPersonIds = [...new Set([...sentChats.map(chat => chat.receiverId), ...receivedChats.map(chat => chat.senderId)])];

        // Optionally, fetch full person objects for these IDs
        const people = await Person.findAll({
            where: { id: distinctPersonIds }
        });

        return res.json({ people });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get all chats with a specific person
router.get("/:personId/chats/:otherPersonId", async (req, res) => {
    const { personId, otherPersonId } = req.params;

    try {
        const person = await Person.findByPk(personId);
        const otherPerson = await Person.findByPk(otherPersonId);

        if (!person || !otherPerson) {
            return res.status(404).json({ error: "Person not found" });
        }

        // Find all chats between the two persons
        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { senderId: personId, receiverId: otherPersonId },
                    { senderId: otherPersonId, receiverId: personId }
                ]
            },
        });

        return res.json({ person, otherPerson, chats });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Route to send a chat from one person to another
router.post("/send", async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    let senderUser = await Person.findByPk(senderId, {
        attributes: ["name"],
    });

    let receiverUser = await Person.findByPk(receiverId, {
        attributes: ["fcmID"],
    });

    senderUser = senderUser.toJSON();
    receiverUser = receiverUser.toJSON();

    console.log("SEND", senderUser, receiverUser);

    try {
        const sender = await Person.findByPk(senderId);
        const receiver = await Person.findByPk(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        const chat = await Chat.create({ senderId, receiverId, message });

        const payload = {
            notification: {
                title: `Message from ${senderUser.name}`,
                body: message,
            },
        };

        admin.messaging().sendToDevice(receiverUser.fcmID, payload)
            .then((response) => {
                console.log("Successfully sent message:", response);
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });

        return res.json({ sender, receiver, chat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
