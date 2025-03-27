// routes/NhanVien.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const NhanVien = require("../models/NhanVien");
const DocGia = require("../models/DocGia");
const { ROLES, ERROR, PASSWORD, SUCCESS } = require("../constants");

// Liệt kê danh sách nhân viên
router.get("/", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const danhSachNhanVien = await NhanVien.find();
    res.json(danhSachNhanVien);
  } catch (error) {
    res.status(500).json({ message: ERROR.FETCH_ACCOUNT_LIST });
  }
});

// Tìm kiếm nhân viên theo tên
router.get("/timkiem/ten", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { Ten } = req.query;
    const ketQua = await NhanVien.find({ Ten: { $regex: Ten } });
    res.json(ketQua);
  } catch (error) {
    res.status(500).json({ message: ERROR.FIND_BY_NAME });
  }
});

// Tìm kiếm nhân viên theo số điện thoại
router.get("/timkiem/sodienthoai", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { DienThoai } = req.query;
    const ketQua = await NhanVien.findOne({ DienThoai });
    res.json(ketQua);
  } catch (error) {
    res.status(500).json({ message: ERROR.FIND_BY_PHONE });
  }
});

// Tạo nhân viên mới
router.post("/add", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const { HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;
    const hashedPassword = await bcrypt.hash(Password, PASSWORD.SALT_ROUNDS);

    // Tạo nhân viên mới với mật khẩu đã được hash
    const NhanVienMoi = new NhanVien({
      HoTenNV,
      ChucVu,
      DiaChi,
      SoDienThoai,
      Password: hashedPassword,
    });

    await NhanVienMoi.save();
    res.json({ message: SUCCESS.CREATE_ACCOUNT_SUCCESS });
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    res.status(500).json({ message: ERROR.CREATE_ACCOUNT_ERROR });
  }
});

// Sửa thông tin nhân viên
router.put("/edit/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const { Password, SoDienThoai, ...otherFields } = req.body;

    if (SoDienThoai) {
      const phoneExists = await Promise.all([
        DocGia.findOne({ SoDienThoai }),
        NhanVien.findOne({ SoDienThoai, _id: { $ne: id } }),
      ]);

      if (phoneExists[0] || phoneExists[1]) {
        return res
          .status(400)
          .json({ message: "Số điện thoại đã tồn tại trong hệ thống" });
      }
    }

    let updatedFields = { ...otherFields, SoDienThoai };

    // Nếu có mật khẩu mới thì mã hóa
    if (Password !== undefined && Password.trim() !== "") {
      updatedFields.Password = await bcrypt.hash(Password, 10);
    } else if (Password === "" || Password === null) {
      delete updatedFields.Password; // Nếu mật khẩu rỗng hoặc null thì không thay đổi
    } else {
      // Nếu không có mật khẩu mới, giữ nguyên mật khẩu cũ
      const nhanVien = await NhanVien.findById(id);
      if (nhanVien && nhanVien.Password) {
        updatedFields.Password = nhanVien.Password;
      }
    }

    const NhanVienCapNhat = await NhanVien.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );
    res.json({
      message: "Thông tin nhân viên đã được cập nhật",
      NhanVien: NhanVienCapNhat,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật nhân viên" });
  }
});

// Xóa nhân viên
router.delete("/delete/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    await NhanVien.findByIdAndDelete(id);
    res.json({ message: SUCCESS.DELETE_ACCOUNT_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: ERROR.DELETE_ACCOUNT_ERROR });
  }
});

module.exports = router;
