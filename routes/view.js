const { Router } = require("express");
const auth = require("../middlewares/auth");
const loggedIn = require("../middlewares/loggedIn");
const router = Router();

router.get("/login", loggedIn, (req, res) => {
  res.clearCookie("username");
  res.render("login");
});

router.get("/home", auth, (req, res) => {
  res.render("main");
});

router.post("/register", (req, res) => {
  res.cookie("username", req.body.name);
  req.session.user = {
    name: req.body.name,
    admin: true,
  };
  res.redirect("/home");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/?error=" + err);
    }
    res.render("logout");
  });
});

module.exports = router;
