const authUser = require("../models/autUserSchema");
var moment = require("moment");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const user_welcome_get = (req, res) => {
  res.render("../views/welcome.ejs");
};

const user_index_get = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  authUser
    .findById(decoded.id)
    .then((result) => {
      res.render("index", { mytitle: "Home page", arr: result.studentInfo });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_get = (req, res) => {
  res.render("pages/add");
};

const user_view_get = (req, res) => {
  res.render("pages/view");
};

const user_edit_get = (req, res) => {
  res.render("pages/edit");
};

const user_student_get = (req, res) => {
  authUser.findOne({ "studentInfo._id": req.params.id }).then((result) => {
    const clickedObject = result.studentInfo.find((item) => {
      return item._id == req.params.id;
    });
    res.render("pages/view", { info: clickedObject, moment: moment });
  });
};

const user_signup_get = (req, res) => {
  res.render("../views/auth/signup.ejs");
};

const user_login_get = (req, res) => {
  res.render("../views/auth/login.ejs");
};

const user_edit_id = (req, res) => {
  authUser.findOne({ "studentInfo._id": req.params.id }).then((result) => {
    const clickedObject = result.studentInfo.find((item) => {
      return item._id == req.params.id;
    });
    res.render("pages/edit", { info: clickedObject, moment: moment });
  });
};

const user_index_post = (req, res) => {
  const mydata = new Mydata(req.body);
  mydata
    .save()
    .then((result) => {
      res.redirect("/index.html");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_post = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  authUser
    .updateOne({ _id: decoded.id }, { $push: { studentInfo: req.body } })
    .then((result) => {
      console.log(result);
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_login_post = async (req, res) => {
  const loginUser = await authUser.findOne({ email: req.body.email });
  if (loginUser === null) {
    return res.json({
      emailError: "البريد الالكتروني غير موجود يرجي انشاء حساب",
    });
  } else {
    const match = await bcrypt.compare(req.body.password, loginUser.password);
    if (match) {
      var token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({ id: loginUser._id });
    } else {
      res.json({ passwordEroor: "كلمة السر خاطئة" });
    }
  }
};

const user_search = (req, res) => {
  const serachText = req.body.serachText.trim();
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  authUser
    .findOne({ _id: decoded.id })
    .then((result) => {
      const searchStudent = result.studentInfo.filter((item) => {
        return item.firstName.includes(serachText) || item.lastName.includes(serachText)
      });
      res.render("./pages/search", { info: searchStudent, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_delte = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  authUser
    .updateOne(
      { _id: decoded.id },
      { $pull: { studentInfo: { _id: req.params.id } } }
    )
    .then((result) => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_update = (req, res) => {
  authUser
    .updateOne(
      { "studentInfo._id": req.params.id },
      { "studentInfo.$": req.body }
    )
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  user_welcome_get,
  user_index_get,
  user_add_get,
  user_view_get,
  user_edit_get,
  user_student_get,
  user_signup_get,
  user_login_get,
  user_edit_id,
  user_index_post,
  user_add_post,
  user_login_post,
  user_search,
  user_delte,
  user_update,
};
