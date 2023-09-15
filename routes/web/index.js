var express = require("express");
var router = express.Router();

const moment = require("moment");

const AccountModel = require("../../models/AccountModel");

const checkLoginMiddleware = require("../../middlewares/checkLoginMiddleware");

router.get("/", (req, res) => {
  //重定向 /account
  res.redirect("/account");
});

//记账本的列表
router.get("/account", checkLoginMiddleware, function (req, res, next) {
  AccountModel.find()
    .sort({ time: -1 })
    .exec()
    .then((data) => res.render("list", { accounts: data, moment: moment }))
    .catch(() => {
      res.status(500).send("读取失败~~~");
    });
});

//添加记录
router.get("/account/create", checkLoginMiddleware, function (req, res, next) {
  res.render("create");
});
//新增记录
router.post("/account", checkLoginMiddleware, (req, res) => {
  //插入数据库
  AccountModel.create({
    ...req.body,
    //修改 time 属性的值
    time: moment(req.body.time).toDate(),
  })
    .then((data) => {
      res.render("success", { msg: "添加成功哦~~~", url: "/account" });
    })
    .catch((err) => {
      res.status(500).send("插入失败~~");
      return;
    });
});

//删除记录
router.get("/account/:id", checkLoginMiddleware, (req, res) => {
  //获取 params 的 id 参数
  const id = req.params.id;
  //删除
  AccountModel.deleteOne({ _id: id })
    .then(() => {
      res.render("success", { msg: "删除成功~~~", url: "/account" });
    })
    .catch(() => {
      res.status(500).send("删除失败~");
    });
});

module.exports = router;
