const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { secret } = require("../../config/config");
const UserModel = require("../../models/UserModel");

//登录操作
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username, password: md5(password) })
    .then((data) => {
      if (!data) {
        res.json({
          code: "2002",
          msg: "用户名或密码错误~~~",
          data: null,
        });
      }

      const token = jwt.sign(
        {
          username: data.username,
          _id: data._id,
        },
        secret,
        {
          expiresIn: 60 * 60 * 24 * 7,
        }
      );
      res.json({
        code: "0000",
        msg: "登录成功",
        data: token,
      });
    })
    .catch(() => {
      res.json({
        code: "2001",
        msg: "数据库读取失败~~~",
        data: null,
      });
    });
});

//退出登录
router.post("/logout", (req, res) => {
  //销毁 session
  req.session.destroy(() => {
    res.render("success", { msg: "退出成功", url: "/login" });
  });
});

module.exports = router;
