// models/DocGia.js
const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const docGiaSchema = new mongoose.Schema({
  HoLot: { type: String, required: true },
  Ten: { type: String, required: true },
  NgaySinh: { type: Date, required: true },
  Phai: { type: String, enum: ["Nam", "Nữ"], required: true },
  DiaChi: { type: String, required: true },
  SoDienThoai: { type: String, required: true },
  Password: { type: String, required: true },
  Role: { type: String, required: true, default: ROLES.USER },
});

module.exports = mongoose.model("DocGia", docGiaSchema);
