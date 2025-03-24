require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const NhanVien = require("./models/NhanVien");
const { ROLES, PASSWORD } = require("./constants");

// Kết nối CSDL
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  try {
    const existingAdmin = await NhanVien.findOne({ role: ROLES.ADMIN });

    if (existingAdmin) {
      console.log("Admin đã tồn tại!");
      return process.exit();
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
    mongoose.connection.close();
  }
}

createAdmin();
