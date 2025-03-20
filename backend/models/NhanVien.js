// models/NhanVien.js
const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const nhanVienSchema = new mongoose.Schema({
  HoTenNV: { type: String, required: true },
  Password: { type: String, required: true },
  ChucVu: { type: String, required: true },
  DiaChi: { type: String },
  SoDienThoai: { type: String, required: true, unique: true },
  Role: { type: String, required: true, default: ROLES.ADMIN },
});

module.exports = mongoose.model("NhanVien", nhanVienSchema);
