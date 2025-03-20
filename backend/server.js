// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối với MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Đã kết nối đến MongoDB");
  })
  .catch((err) => {
    console.error("Lỗi khi kết nối đến MongoDB:", err.message);
  });

// Import các route
const authRoutes = require("./routes/auth");
const sachRoutes = require("./routes/sach");
const docGiaRoutes = require("./routes/docgia");
const nhanVienRoutes = require("./routes/nhanvien");
const nhaXuatBanRoutes = require("./routes/nhaxuatban");
const theoDoiMuonSachRoutes = require("./routes/theodoimuonsach");
const statsRoutes = require("./routes/stats");

// Sử dụng các route
app.use("/api/auth", authRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/docgia", docGiaRoutes);
app.use("/api/nhanvien", nhanVienRoutes);
app.use("/api/nhaxuatban", nhaXuatBanRoutes);
app.use("/api/muonsach", theoDoiMuonSachRoutes);
app.use("/api/stats", statsRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
