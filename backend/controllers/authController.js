const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NhanVien = require("../models/NhanVien");
const DocGia = require("../models/DocGia");
const {
  VALIDATION_MESSAGES,
  MIN_YEAR,
  ROLES,
  JWT,
  SUCCESS,
  ERROR,
} = require("../constants");

exports.register = async (req, res) => {
  try {
    const { HoLot, Ten, NgaySinh, Phai, DiaChi, SoDienThoai, Password } =
      req.body;

    // Kiểm tra nếu số điện thoại đã tồn tại
    const existingUser = await DocGia.findOne({ SoDienThoai });
    const existingAdmin = await NhanVien.findOne({ SoDienThoai });

    if (existingUser || existingAdmin) {
      return res
        .status(400)
        .json({ message: VALIDATION_MESSAGES.PHONE_EXISTS });
    }
    if (Phai !== "Nam" && Phai !== "Nữ") {
      return res
        .status(400)
        .json({ message: VALIDATION_MESSAGES.INVALID_GENDER });
    }
    const minDate = new Date(`${MIN_YEAR}-01-01`);
    if (new Date(NgaySinh) <= minDate) {
      return res
        .status(400)
        .json({ message: VALIDATION_MESSAGES.INVALID_BIRTHDATE });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(Password, 10);
    // Tạo độc giả mới
    const newDocGia = new DocGia({
      HoLot,
      Ten,
      NgaySinh,
      Phai,
      DiaChi,
      SoDienThoai,
      Password: hashedPassword,
      Role: ROLES.USER, // Thiết lập role là 'user' cho độc giả
    });

    // Lưu độc giả vào database
    await newDocGia.save();

    // Tạo token với vai trò user
    const token = jwt.sign(
      { id: newDocGia._id, role: newDocGia.Role },
      process.env.JWT_SECRET,
      { expiresIn: JWT.EXPIRATION }
    );

    // Trả về token và role
    res.status(201).json({
      message: SUCCESS.REGISTER_SUCCESS,
      token,
      role: newDocGia.Role,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký độc giả:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { SoDienThoai, Password } = req.body;

    // Kiểm tra nếu số điện thoại có trong bảng NhanVien
    let user = await NhanVien.findOne({ SoDienThoai });
    let role = "admin";

    if (!user) {
      // Nếu không tìm thấy trong bảng NhanVien, kiểm tra trong bảng DocGia
      user = await DocGia.findOne({ SoDienThoai });
      role = "user";
    }

    if (!user) {
      return res.status(400).json({ message: ERROR.USER_NOT_FOUND });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res
        .status(500)
        .json({ message: VALIDATION_MESSAGES.INCORRECT_PASSWORD });
    }

    // Tạo token với vai trò người dùng
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Trả về token, role và thông tin người dùng
    res.json({ token, role, user });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ error: error.message });
  }
};
