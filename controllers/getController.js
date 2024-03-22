const express = require("express");
const router = express.Router();
const Investment = require("../models/Investment");
const Person = require("../models/Person");

// Controller to get all investments
router.get("/investments", async (req, res) => {
    try {
        const investments = await Investment.findAll();
        res.json(investments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/investments/:id", async (req, res) => {
    const id = req.params.id;
    const investment = await Investment.findByPk(id);
    res.json(investment);
});

router.get("/persons", async (req, res) => {
    try {
        const type = req.query.type; // Assuming the query parameter is named 'type'
        let persons;

        if (type === "investee") {
            persons = await Person.findAll({ where: { type: "investee" } });
        } else if (type === "investor") {
            persons = await Person.findAll({ where: { type: "investor" } });
        } else {
            persons = await Person.findAll();
        }

        res.json(persons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;