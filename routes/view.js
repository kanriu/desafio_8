const { Router } = require("express");
const auth = require("../middlewares/auth");
const loggedIn = require("../middlewares/loggedIn");
const passport = require("passport");
const router = Router();

router.get("/info", (req, res) => {
  const entrada =
    process.argv.slice(2).toString().replace(",", " ") ||
    "No hay parámetros de entrada";
  const info = {
    entrada: entrada,
    plataforma: process.platform,
    version: process.version,
    memoria: process.memoryUsage().rss,
    path: process.execPath,
    id: process.pid,
    proyecto: process.cwd(),
  };
  res.render("info", { info });
});

router.get("/login", loggedIn, (req, res) => {
  res.clearCookie("username");
  res.render("login");
});

router.get("/home", auth, (req, res) => {
  res.render("main");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/fail-login", (req, res) => {
  res.render("failLogin");
});
router.get("/fail-register", (req, res) => {
  res.render("failRegister");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/fail-register",
    failureFlash: true,
  }),
  (req, res) => {
    res.cookie("username", req.body.email);
    req.session.user = {
      name: req.body.email,
    };
    res.redirect("/home");
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail-login",
    failureFlash: true,
  }),
  (req, res) => {
    res.cookie("username", req.body.email);
    req.session.user = {
      name: req.body.email,
    };
    res.redirect("/home");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/?error=" + err);
    }
    res.render("logout");
  });
});

module.exports = router;
