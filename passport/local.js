const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/Users");

module.exports = (passport) => {
  const authenticateUser = async (email, password, done) => {
    console.log(email, password);
    try {
      if (!(await userModel.existsByEmail(email))) {
        console.log("no email");
        return done(null, false, { message: "user does not exist!" });
      }

      if (!(await userModel.isPasswordValid(email, password))) {
        console.log("incorrect pwd");
        return done(null, false, { message: "incorrect password!" });
      }

      console.log("user");
      const user = await userModel.getByEmail(email);

      done(null, user);
    } catch (err) {
      done(err);
    }
  };

  const registerUser = async (req, email, password, done) => {
    try {
      if (await userModel.existsByEmail(email)) {
        return done(null, false, { message: "user already exists!" });
      }

      const user = await userModel.save({
        email,
        password: password,
      });

      console.log(user);

      done(null, user);
    } catch (err) {
      done(err);
    }
  };

  // registrar estrategias
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passwordField: "pwd" },
      authenticateUser
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passwordField: "pwd", passReqToCallback: true },
      registerUser
    )
  );

  // serializar usuario
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    console.log("id");
    return done(null, await userModel.getById(id));
  });
};