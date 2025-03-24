const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const NhanVien = require("./models/NhanVien");
const { ROLES, PASSWORD } = require("./constants");

dotenv.config();

// Kiểm tra biến môi trường
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI không được định nghĩa trong .env");
}

// Kết nối CSDL
mongoose
  .connect(uri, {})
  .then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });

async function createAdmin() {
  try {
    const existingAdmin = await NhanVien.findOne({ Role: ROLES.ADMIN });

    if (existingAdmin) {
      console.log("Admin đã tồn tại! Thoát script...");
      return;
    }

    const hashedPassword = await bcrypt.hash("vanlam", PASSWORD.SALT_ROUNDS);

    const newAdmin = new NhanVien({
      HoTenNV: "Van Lam",
      Password: hashedPassword,
      ChucVu: "BOSS",
      DiaChi: "TP",
      SoDienThoai: "0341111111",
      Role: ROLES.ADMIN,
    });

    await newAdmin.save();
    console.log("Admin đã được tạo thành công!");
  } catch (error) {
    console.error("Lỗi khi tạo Admin:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(); // Thoát chương trình sau khi hoàn tất
  }
}

createAdmin();
