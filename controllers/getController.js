// Assuming you're using Express.js for routing

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

// Controller to get all persons
router.get("/persons", async (req, res) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
