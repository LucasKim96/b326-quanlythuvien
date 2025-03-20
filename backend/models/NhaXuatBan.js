// models/NhaXuatBan.js
const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
    TenNXB: { type: String, required: true },
    DiaChi: { type: String }
});

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
