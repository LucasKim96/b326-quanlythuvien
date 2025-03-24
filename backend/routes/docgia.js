// routes/docgia.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const DocGia = require("../models/DocGia");
const { ROLES, SUCCESS, ERROR, PASSWORD } = require("../constants");

// Liệt kê danh sách độc giả
router.get("/", auth([]), async (req, res) => {
  try {
    const danhSachDocGia = await DocGia.find();
    res.json(danhSachDocGia);
  } catch (error) {
    res.status(500).json({ message: ERROR.FETCH_ACCOUNT_LIST });
  }
});

// Tìm kiếm độc giả theo tên
router.get("/timkiem/ten", auth([]), async (req, res) => {
  try {
    const { Ten } = req.query;
    const ketQua = await DocGia.find({ Ten: Ten });
    res.json(ketQua);
  } catch (error) {
    res.status(500).json({ message: ERROR.FIND_BY_NAME });
  }
});

// Tìm kiếm độc giả theo số điện thoại
router.get("/timkiem/sodienthoai", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { DienThoai } = req.query;
    const ketQua = await DocGia.find({ DienThoai });
    res.json(ketQua);
  } catch (error) {
    res.status(500).json({ message: ERROR.FIND_BY_PHONE });
  }
});

// Tạo độc giả mới
router.post("/add", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const docGiaMoi = new DocGia(req.body);
    const hashedPassword = await bcrypt.hash(docGiaMoi.Password, 10);
    docGiaMoi.Password = hashedPassword;
    await docGiaMoi.save();
    res.json({ message: SUCCESS.CREATE_ACCOUNT_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: ERROR.CREATE_ACCOUNT_ERROR });
  }
});

router.put("/edit/:id", auth([]), async (req, res) => {
  try {
    const { id } = req.params;
    const { Password, ...otherFields } = req.body; // Tách riêng Password để xử lý riêng

    let updatedFields = { ...otherFields };

    // Kiểm tra nếu Password được gửi và không rỗng
    if (Password && Password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(Password, PASSWORD.SALT_ROUNDS);
      updatedFields.Password = hashedPassword; // Gắn mật khẩu đã băm vào updatedFields
    }

    const docGiaCapNhat = await DocGia.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json({
      message: SUCCESS.UPDATE_ACCOUNT_SUCCESS,
      docGia: docGiaCapNhat,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật độc giả:", error);
    res.status(500).json({ message: ERROR.UPDATE_ACCOUNT_ERROR });
  }
});

// Xóa độc giả
router.delete("/delete/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    await DocGia.findByIdAndDelete(id);
    res.json({ message: SUCCESS.DELETE_ACCOUNT_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: ERROR.DELETE_ACCOUNT_ERROR });
  }
});

module.exports = router;
