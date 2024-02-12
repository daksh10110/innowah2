const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Person } = require("../models");
const { SECRET } = require("./config");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await Person.findOne({ where: { email } });

                // Check if user exists and the password is correct
                if (!user || !user.comparePassword(password)) {
                    return done(null, false);
                }

                // If user found and password is correct, return the user
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            // Find the user in the database
            const user = await Person.findByPk(jwtPayload.sub);

            if (user) {
                return done(null, user);
            } else {
                // If user not found, authentication fails
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;