var express = require("express");
var router = express.Router();

const AccountModel = require("../../models/AccountModel");
const moment = require("moment");

// 新增账目
router.post("/account", (req, res) => {
  //插入数据库
  AccountModel.create({
    ...req.body,
    //修改 time 属性的值
    time: moment(req.body.time).toDate(),
  })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "创建成功",
        data: data,
      });
    })
    .catch(() => {
      res.json({
        code: "1002",
        msg: "创建失败~~",
        data: null,
      });
    });
});

// 删除账目
router.get("/account/:id", (req, res) => {
  //获取 params 的 id 参数
  const id = req.params.id;
  //删除
  AccountModel.deleteOne({ _id: id })
    .then(() => {
      res.json({
        code: "0000",
        msg: "删除成功",
        data: {},
      });
    })
    .catch(() => {
      res.json({
        code: "1003",
        msg: "删除账单失败",
        data: null,
      });
    });
});

// 更新账目
router.patch("/account/:id", (req, res) => {
  //获取 id 参数值
  const { id } = req.params;
  //更新数据库
  AccountModel.updateOne({ _id: id }, req.body)
    .then(() => {
      AccountModel.findById(id);
    })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "更新成功",
        data: data,
      });
    })
    .catch(() => {
      res.json({
        code: "1004",
        msg: "读取失败~~",
        data: null,
      });
    });
});

// 获取账目
router.get("/account/:id", (req, res) => {
  //获取 id 参数
  const { id } = req.params;
  //查询数据库
  AccountModel.findById(id)
    .then((data) => {
      res.json({
        code: "0000",
        msg: "读取成功",
        data: data,
      });
    })
    .catch(() => {
      res.json({
        code: "1004",
        msg: "读取失败~~",
        data: null,
      });
    });
});

// 获取记账本列表
router.get("/account", function (req, res, next) {
  AccountModel.find()
    .sort({ time: -1 })
    .exec()
    .then((data) =>
      res.json({
        //响应编号
        code: "0000",
        //响应的信息
        msg: "读取成功",
        //响应的数据
        data: data,
      })
    )
    .catch(() => {
      res.json({
        code: "1001",
        msg: "读取失败~~",
        data: null,
      });
    });
});

module.exports = router;
