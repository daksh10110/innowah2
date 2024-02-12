const express = require("express");
const passport = require("../utils/middleware");
const jwt = require("jsonwebtoken");
const { Person } = require("../models");
const { SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, type, pan, phoneNumber } = req.body;

        // Check if the provided type is valid
        if (!["investor", "investee"].includes(type)) {
            return res.status(400).json({ message: "Invalid person type" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new person
        const newPerson = await Person.create({ name, email, password: hashedPassword, type, pan, phoneNumber });

        return res.json({ person: newPerson });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, person) => {
        if (err || !person) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        req.login(person, { session: false }, (loginErr) => {
            if (loginErr) {
                return res.status(500).json({ message: "Internal Server Error" });
            }

            // Generate JWT
            const token = jwt.sign({ sub: person.id }, SECRET);

            return res.json({ person, token });
        });
    })(req, res, next);
});

// Logout route (invalidate the token on the client-side)
router.post("/logout", (req, res) => {
    res.json({ message: "Logout successful" });
});

module.exports = router;