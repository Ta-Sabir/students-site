const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const { requireAuth } = require("../middleware/middleware");
const { chekIfUser } = require("../middleware/middleware");
const { check, validationResult } = require("express-validator");
const authUser = require("../models/autUserSchema");
var jwt = require("jsonwebtoken");
// GET Requst

router.get("*", chekIfUser);

router.get("/signout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

router.get("/", userController.user_welcome_get);

router.get("/home", requireAuth, userController.user_index_get);

router.get("/pages/add.html", requireAuth, userController.user_add_get);

router.get("/pages/view.html", requireAuth, userController.user_view_get);

router.get("/pages/edit.html", requireAuth, userController.user_edit_get);

router.get("/student/:id", requireAuth, userController.user_student_get);

router.get("/edit/:id", requireAuth, userController.user_edit_id);

router.get("/signup", userController.user_signup_get);

router.get("/login", userController.user_login_get);

// POST

router.post("/home", userController.user_index_post);

router.post("/pages/add.html", userController.user_add_post);

router.post("/search", userController.user_search);

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {
    try {
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json({ arrValidationError: objError.errors });
      }

      const isCurrentEmail = await authUser.findOne({ email: req.body.email });
      if (isCurrentEmail) {
        return res.json({ currentEmail: "هذا البريد الالكتروني مسجل من قبل , يرجي تسجيل الدخول مباشرة" })
      }

      const newUser = await authUser.create(req.body);
      var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({ id: newUser._id })

    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/login", userController.user_login_post);

// DELTE REQUEST
router.delete("/edit/:id", userController.user_delte);

// UPDATE DATA
router.put("/edit/:id", userController.user_update);

module.exports = router;
