// models/TheoDoiMuonSach.js
const mongoose = require("mongoose");
const {
  LOAN_STATUS,
  ERROR,
  MESSAGES,
  MAX_BOOKS_ALLOWED,
} = require("../constants");

const theoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DocGia",
    required: true,
  },
  MaSach: { type: mongoose.Schema.Types.ObjectId, ref: "Sach", required: true },
  NgayMuon: { type: Date, required: true, default: Date.now },
  NgayTra: {
    type: Date,
    default: function () {
      return new Date(this.NgayMuon.getTime() + 14 * 24 * 60 * 60 * 1000);
    },
    validate: {
      validator: function (value) {
        return !value || value >= this.NgayMuon;
      },
      message: MESSAGES.INVALID_RETURN_DATE,
    },
  },
  TrangThai: {
    type: String,
    enum: Object.values(LOAN_STATUS),
    default: "Chờ duyệt",
  },
});

// Hook kiểm tra số lượng sách mượn tối đa trước khi lưu
theoDoiMuonSachSchema.pre("save", async function (next) {
  const TheoDoiMuonSach = mongoose.model("TheoDoiMuonSach");
  if (!this.MaDocGia) {
    return next(new Error(ERROR.INVALID_READER_ID));
  }

  const booksBorrowed = await TheoDoiMuonSach.aggregate([
    {
      $match: {
        MaDocGia: this.MaDocGia,
        TrangThai: { $in: [LOAN_STATUS.BORROWED, LOAN_STATUS.OVERDUE] },
      },
    },
    { $unwind: "$SachMuon" },
    { $group: { _id: "$MaDocGia", totalBooks: { $sum: "$SachMuon.SoLuong" } } },
  ]);

  const totalBorrowed =
    booksBorrowed.length > 0 ? booksBorrowed[0].totalBooks : 0;
  const totalCurrentRequest = (this.SachMuon || []).reduce(
    (sum, book) => sum + (book.SoLuong || 0),
    0
  );

  if (totalBorrowed + totalCurrentRequest > MAX_BOOKS_ALLOWED) {
    return next(new Error(MESSAGES.MAX_BORROW_LIMIT_EXCEEDED));
  }

  next();
});

module.exports = mongoose.model("TheoDoiMuonSach", theoDoiMuonSachSchema);
