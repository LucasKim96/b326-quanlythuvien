// routes/nhaxuatban.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const NhaXuatBan = require("../models/NhaXuatBan");
const Sach = require("../models/Sach");
const { ERROR, ROLES, SUCCESS } = require("../constants");

// Liệt kê danh sách nhà xuất bản
router.get("/", auth, async (req, res) => {
  try {
    const danhSachNhaXuatBan = await NhaXuatBan.find();
    res.json(danhSachNhaXuatBan);
  } catch (error) {
    res.status(500).json({ message: ERROR.FETCH_PUBLISHER_LIST });
  }
});

// Thêm nhà xuất bản mới
router.post("/add", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const nhaXuatBanMoi = new NhaXuatBan(req.body);
    await nhaXuatBanMoi.save();
    res.json({ message: SUCCESS.CREATE_PUBLISHER_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: ERROR.CREATE_PUBLISHER_ERROR });
  }
});

// Sửa thông tin nhà xuất bản
router.put("/edit/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const nhaXuatBanCapNhat = await NhaXuatBan.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: SUCCESS.UPDATE_PUBLISHER_SUCCESS,
      nhaXuatBan: nhaXuatBanCapNhat,
    });
  } catch (error) {
    res.status(500).json({ message: ERROR.UPDATE_PUBLISHER_ERROR });
  }
});

// Xóa nhà xuất bản
router.delete("/delete/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem NXB có sách nào liên quan không
    const isPublisherUsed = await Sach.find({ id });
    if (isPublisherUsed) {
      return res.status(400).json({
        message: ERROR.CANNOT_DELETE_PUBLISHER,
      });
    }

    // Xóa NXB nếu không có sách liên quan
    const nxbXoa = await NhaXuatBan.findByIdAndDelete(id);
    if (!nxbXoa) {
      return res.status(404).json({ message: ERROR.PUBLISHER_NOT_FOUND });
    }

    res.json({ message: SUCCESS.DELETE_PUBLISHER_SUCCESS });
  } catch (error) {
    console.error("Error deleting publisher:", error);
    res.status(500).json({ message: ERROR.DELETE_PUBLISHER_ERROR });
  }
});

module.exports = router;
