// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const NhanVien = require("../models/NhanVien");
const DocGia = require("../models/DocGia");
const { ROLES, ERROR } = require("../constants");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", auth([]), async (req, res) => {
  try {
    const user = await (req.user.role === ROLES.ADMIN
      ? NhanVien.findById(req.user.id)
      : DocGia.findById(req.user.id));

    if (!user) {
      return res.status(404).json({ message: ERROR.USER_NOT_FOUND });
    }

    res.json({ user });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
