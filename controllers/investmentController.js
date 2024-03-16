const express = require("express");
const passport = require("../utils/middleware");
const jwt = require("jsonwebtoken");
const { Person, Investment, InvestmentRelationship } = require("../models");
const { SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");

const router = express.Router();
router.post(
  "/invest",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { investeeId, amount, investmentId } = req.body;
      const investorId = req.user.id; // Extract investor ID from authenticated user

      // Fetch investor and investee details
      const investor = await Person.findByPk(investorId);
      const investee = await Person.findByPk(investeeId);

      if (!investor || !investee) {
        return res
          .status(404)
          .json({ message: "Investor or investee not found" });
      }

      // Update the investment amount acquired in the Investment model
      const investment = await Investment.findByPk(investmentId);
      if (investment) {
        // Check if there's an existing investment relationship with the same investor, investee, and investmentId
        let existingRelationship = await InvestmentRelationship.findOne({
          where: {
            investorId: investorId,
            investeeId: investeeId,
            investmentId: investmentId,
          },
        });

        if (amount < investment.minimumInvestment) {
          return res
            .status(400)
            .json({ message: "Amount is below minimum investment" });
        }

        if (existingRelationship) {
          // If an existing relationship is found, add the new investment amount to the existing amount
          existingRelationship.investmentAmount += amount;
          await existingRelationship.save();
        } else {
          // Otherwise, create a new investment relationship
          existingRelationship = await InvestmentRelationship.create({
            investorId: investorId,
            investeeId: investeeId,
            investmentId: investmentId,
            investmentAmount: amount, // Assuming amount is the investment amount
          });
        }

        // Update the investee's accumulated investment amount
        investee.investmentAmount += amount;
        await investee.save();

        // Add the investor's ID to the array of other investors
        if (!investment.otherInvestors.includes(investorId)) {
          investment.otherInvestors.push(investorId);
          await investment.save();
        }

        // Update the investment amount acquired
        investment.investmentAmountAcquired += amount;
        await investment.save();

        return res.json({ message: "Investment successful" });
      } else {
        return res.status(404).json({ message: "Investment not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/createInvestment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const {
        lastDateToInvest,
        investmentAmountNeeded,
        expectedReturns,
        minimumInvestment,
        listingType,
        description,
        imageURL,
        location,
      } = req.body;
      const investeeId = req.user.id; // Extract investor ID from authenticated use
      console.log("SKIBIDI", req.user);

      const investee = req.user;

      if (investee.type === "investor") {
        return res.status(404).json({ message: "Wrong Type of User" });
      }

      if (!investee) {
        return res.status(404).json({ message: "Investee not found" });
      }

      // Create the investment
      const investment = await Investment.create({
        date: new Date(),
        location: location,
        investeeName: investee.name,
        investeeId: investeeId,
        investmentAmountNeeded: investmentAmountNeeded,
        investmentAmountAcquired: 0,
        expectedReturns: expectedReturns,
        minimumInvestment: minimumInvestment, // Example minimum investment
        listingType: listingType,
        description: description,
        imageURL: imageURL,
        lastDateToInvest: new Date(lastDateToInvest),
      });

      return res.json({
        message: "Creation Investment successful",
        investment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
