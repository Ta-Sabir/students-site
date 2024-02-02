var jwt = require("jsonwebtoken");
const authUser = require("../models/autUserSchema");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "saber", (err) => {
      if (err) {
        res.redirect("/signup");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/signup");
  }
};

const chekIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "saber", async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const userLogin = await authUser.findById(decoded.id);
        res.locals.user = userLogin;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, chekIfUser };
