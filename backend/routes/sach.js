// routes/sach.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Sach = require("../models/Sach");
const NhaXuatBan = require("../models/NhaXuatBan");
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");
const { ERROR, ROLES, SUCCESS, LOAN_STATUS } = require("../constants");

// Lấy tổng số quyển sách (bao gồm đang có và đang mượn) cho từng tựa sách
router.get("/", auth([]), async (req, res) => {
  try {
    const allBooks = await Sach.find();
    const borrowedBooks = await TheoDoiMuonSach.find({
      TrangThai: LOAN_STATUS.BORROWED,
    }); // Lấy sách đang mượn

    const booksWithTotal = allBooks.map((book) => {
      const borrowedCount = borrowedBooks.filter(
        (borrow) =>
          borrow.MaSach && borrow.MaSach.toString() === book._id.toString()
      ).length;
      const sum = book.SoQuyen + borrowedCount;
      return {
        ...book.toObject(), // Convert Mongoose document to plain object
        tongso: sum,
      };
    });
    res.json(booksWithTotal); // Trả về mảng các sách với tổng số lượng
  } catch (error) {
    console.error("Lỗi khi lấy tổng số sách:", error);
    res.status(500).json({ message: ERROR.GET_TOTAL_BOOKS_ERROR });
  }
});

// Tìm kiếm sách theo tên
router.get("/timkiem/tensach", auth([]), async (req, res) => {
  try {
    const { TenSach } = req.query;
    const ketQua = await Sach.find({
      TenSach: { $regex: TenSach, $options: "i" },
    });
    res.json(ketQua);
  } catch (error) {
    res.status(500).json({ message: ERROR.FIND_BOOK_BY_NAME });
  }
});

// Tìm kiếm sách theo tác giả
router.get("/timkiem/tacgia", auth([]), async (req, res) => {
  try {
    const { TacGia } = req.query;
    const ketQua = await Sach.find({
      TacGia: { $regex: TacGia, $options: "i" },
    });
    res.json(ketQua);
  } catch (error) {
    res.status(500).json({ message: ERROR.FIND_BOOK_BY_AUHTOR });
  }
});

// Thêm sách mới
router.post("/add", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, TacGia } = req.body;

    // Tạo sách mới với mã nhà xuất bản
    const sachMoi = new Sach({
      TenSach,
      DonGia,
      SoQuyen,
      NamXuatBan,
      MaNXB,
      TacGia,
    });

    await sachMoi.save();
    res.json({ message: SUCCESS.CREATE_BOOK_SUCCESS });
  } catch (error) {
    console.error("Lỗi khi thêm sách:", error);
    res.status(500).json({ message: ERROR.CREATE_BOOK_ERROR });
  }
});

// Sửa thông tin sách
router.put("/edit/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const { TenSach, DonGia, SoQuyen, NamXuatBan, TacGia, TenNXB } = req.body;

    // Tìm Nhà Xuất Bản dựa trên TenNXB
    const nhaXuatBan = await NhaXuatBan.findOne({ TenNXB });

    // Nếu không tìm thấy NXB, trả về lỗi
    if (!nhaXuatBan) {
      return res.status(404).json({ message: ERROR.PUBLISHER_NOT_FOUND });
    }

    // Lấy MaNXB từ NXB tìm thấy
    const MaNXB = nhaXuatBan._id;

    // Cập nhật thông tin sách với MaNXB mới
    const sachCapNhat = await Sach.findByIdAndUpdate(
      id,
      { TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, TacGia },
      { new: true }
    );

    if (!sachCapNhat) {
      return res.status(404).json({ message: ERROR.BOOK_NOT_FOUND });
    }

    res.json({ message: SUCCESS.UPDATE_BOOK_SUCCESS, sach: sachCapNhat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERROR.UPDATE_BOOK_ERROR });
  }
});

// Xóa sách
router.delete("/delete/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem sách có đang được mượn không
    const isBookBorrowed = await TheoDoiMuonSach.findOne({ id });
    if (isBookBorrowed) {
      return res.status(400).json({
        message: ERROR.CANNOT_DELETE_BOOK,
      });
    }

    // Xóa sách nếu không có ràng buộc
    const sachXoa = await Sach.findByIdAndDelete(id);
    if (!sachXoa) {
      return res.status(404).json({ message: ERROR.BOOK_NOT_FOUND });
    }

    res.json({ message: SUCCESS.DELETE_BOOK_SUCCESS });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: ERROR.DELETE_BOOK_ERROR });
  }
});

module.exports = router;
