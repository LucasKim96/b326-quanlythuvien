// routes/docgia.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const DocGia = require("../models/DocGia");
const NhanVien = require("../models/NhanVien");
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
    const ketQua = await DocGia.findOne({ SoDienThoai: DienThoai });
    // console.log("kq:", ketQua);
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

// Chỉnh sửa thông tin độc giả
router.put("/edit/:id", auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { SoDienThoai, Password, ...otherFields } = req.body;

    const isPhoneExist = await Promise.all([
      DocGia.findOne({ SoDienThoai, _id: { $ne: id } }),
      NhanVien.findOne({ SoDienThoai }),
    ]);

    if (isPhoneExist[0] || isPhoneExist[1]) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã tồn tại trong hệ thống" });
    }

    let updatedFields = { ...otherFields, SoDienThoai };

    // Chỉ xử lý mật khẩu nếu nó được cung cấp và không rỗng
    if (Password !== undefined) {
      if (Password.trim() !== "") {
        updatedFields.Password = await bcrypt.hash(
          Password,
          PASSWORD.SALT_ROUNDS
        );
      } else {
        // Xử lý trường hợp người dùng cố tình đặt mật khẩu rỗng (tùy theo yêu cầu)
        // Ví dụ: có thể không cho phép hoặc có logic riêng
        // Hiện tại, nếu gửi password rỗng, nó sẽ không được cập nhật (giữ nguyên mật khẩu cũ)
      }
    }

    const docGiaCapNhat = await DocGia.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!docGiaCapNhat) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy độc giả để cập nhật" });
    }

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
