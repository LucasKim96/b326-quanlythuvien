const express = require("express");
const router = express.Router();
const Sach = require("../models/Sach"); // Model sách
const DocGia = require("../models/DocGia"); // Model người dùng
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach"); // Model quản lý mượn sách
const { LOAN_STATUS, ERROR } = require("../constants");

// API lấy thông tin thống kê thư viện
router.get("/", async (req, res) => {
  try {
    // Số lượng sách (tổng số loại sách khác nhau)
    const totalBooks = await Sach.countDocuments();

    // Số lượng quyển (tổng SoQuyen của tất cả các sách)
    const totalCopies = await Sach.aggregate([
      { $group: { _id: null, totalCopies: { $sum: "$SoQuyen" } } },
    ]);

    // Số lượng sách đang mượn (đếm số bản ghi "Đang mượn" trong TheoDoiMuonSach)
    const booksOnLoan = await TheoDoiMuonSach.countDocuments({
      TrangThai: LOAN_STATUS.BORROWED,
    });

    // Số lượng người dùng (tổng số người dùng)
    const activeUsers = await DocGia.countDocuments();

    // Kết quả thống kê
    res.json({
      totalBooks, // Số lượng sách
      totalCopies: totalCopies[0]?.totalCopies || 0, // Số lượng quyển (nếu không có, mặc định là 0)
      booksOnLoan, // Số lượng sách đang mượn
      activeUsers, // Số lượng người dùng
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: ERROR.STATISTIC_ERROR });
  }
});

module.exports = router;
