const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");
const Sach = require("../models/Sach");
const {
  ERROR,
  VALIDATION_MESSAGES,
  LOAN_STATUS,
  MESSAGES,
  ROLES,
} = require("../constants");

// Lấy danh sách các bản ghi mượn sách (admin và user)
router.get("/", auth([]), async (req, res) => {
  try {
    const muonSachList = await TheoDoiMuonSach.find()
      .populate("MaSach", "TenSach")
      .populate("MaDocGia", "Ten SoDienThoai");
    res.json(muonSachList);
  } catch (error) {
    res.status(500).json({ message: ERROR.FETCH_BORROWED_BOOK_LIST });
  }
});

// Lấy danh sách đơn mượn sách của một người dùng cụ thể (admin và user)
router.get("/user/:userId", auth([]), async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm tất cả các bản ghi mượn sách của người dùng với `MaDocGia` = `userId`
    const userMuonSachList = await TheoDoiMuonSach.find({ MaDocGia: userId })
      .populate("MaSach", "TenSach")
      .populate("MaDocGia", "Ten SoDienThoai");

    // Nếu không tìm thấy, trả về thông báo
    if (!userMuonSachList || userMuonSachList.length === 0) {
      return res.status(404).json({ message: ERROR.LOAN_REQUEST_NOT_FOUND });
    }

    res.json(userMuonSachList);
  } catch (error) {
    console.error("Error fetching loan records for user:", error);
    res.status(500).json({
      message: ERROR.FETCH_LOAN_REQUEST_LIST,
    });
  }
});

// Đăng ký mượn sách mới (user)
router.post("/request", auth([]), async (req, res) => {
  try {
    const { MaDocGia, MaSach, NgayMuon, NgayTra } = req.body;

    // Kiểm tra ngày trả phải sau ngày mượn
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(NgayMuon);
    const endDate = new Date(NgayTra);
    startDate.setHours(0, 0, 0, 0); // Đặt về đầu ngày
    endDate.setHours(0, 0, 0, 0); // Đặt về đầu ngày

    if (startDate.getTime() < today.getTime()) {
      return res
        .status(400)
        .json({ message: VALIDATION_MESSAGES.INVALID_START_DATE });
    }

    if (endDate <= startDate) {
      return res
        .status(400)
        .json({ message: VALIDATION_MESSAGES.INVALID_RETURN_DATE });
    }

    // Kiểm tra thời gian mượn không quá 14 ngày
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Đổi ra ngày
    if (diffDays > 14) {
      return res.status(400).json({ message: VALIDATION_MESSAGES.LOAN_PERIOD });
    }

    // Tạo yêu cầu mượn sách mới nếu tất cả điều kiện được đáp ứng
    const muonSachMoi = new TheoDoiMuonSach({
      MaDocGia,
      MaSach,
      NgayMuon,
      NgayTra,
      TrangThai: LOAN_STATUS.PENDING,
    });

    await muonSachMoi.save();
    res.json({ message: MESSAGES.REQUEST_AWAIT_APPROVAL });
  } catch (error) {
    console.error("Error while requesting book loan:", error);
    res.status(500).json({ message: ERROR.LOAN_REGISTRATION_ERROR });
  }
});

// Duyệt yêu cầu mượn sách (chỉ admin)
router.put("/approve/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const id = req.params.id;

    // Lấy yêu cầu mượn sách hiện tại
    const currentMuonSach = await TheoDoiMuonSach.findById(id);

    // Kiểm tra xem yêu cầu mượn sách có tồn tại và trạng thái hiện tại có phải là "Chờ duyệt" hay không
    if (!currentMuonSach) {
      return res.status(404).json({ message: ERROR.LOAN_REQUEST_NOT_FOUND });
    }

    if (currentMuonSach.TrangThai !== LOAN_STATUS.PENDING) {
      return res.status(400).json({
        message: `'Chỉ có thể duyệt các yêu cầu mượn sách đang ở trạng thái ${LOAN_STATUS.PENDING}`,
      });
    }

    // Cập nhật trạng thái thành "Đang mượn"
    const updatedMuonSach = await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      { TrangThai: LOAN_STATUS.BORROWED },
      { new: true }
    );

    // Trừ 1 vào số lượng sách trong bộ sưu tập Sach
    const sach = await Sach.findById(updatedMuonSach.MaSach);
    if (sach && sach.SoQuyen > 0) {
      sach.SoQuyen -= 1;
      await sach.save();
    } else {
      return res.status(400).json({ message: MESSAGES.BOOK_NOT_AVAILABLE });
    }

    res.json({
      message: "Yêu cầu mượn sách đã được duyệt",
      muonSach: updatedMuonSach,
    });
  } catch (error) {
    console.error("Error approving loan request:", error);
    res.status(500).json({ message: "Lỗi khi duyệt yêu cầu mượn sách" });
  }
});

// Cập nhật trạng thái trả sách (chỉ admin)
router.put("/return/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const id = req.params.id;

    // Lấy yêu cầu mượn sách hiện tại
    const currentMuonSach = await TheoDoiMuonSach.findById(id);

    // Kiểm tra xem yêu cầu mượn sách có tồn tại và trạng thái hiện tại có phải là "Đang mượn" hay không
    if (!currentMuonSach) {
      return res.status(404).json({ message: ERROR.LOAN_RECORD_NOT_FOUND });
    }

    if (currentMuonSach.TrangThai !== LOAN_STATUS.BORROWED) {
      return res.status(400).json({
        message: `Chỉ có thể đánh dấu là ${LOAN_STATUS.RETURNED} đối với các yêu cầu đang ở trạng thái ${LOAN_STATUS.BORROWED}`,
      });
    }

    // Cập nhật trạng thái thành "Đã trả"
    const updatedMuonSach = await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      { TrangThai: LOAN_STATUS.RETURNED },
      { new: true }
    );

    // Cộng 1 vào số lượng sách trong bộ sưu tập Sach
    const sach = await Sach.findById(updatedMuonSach.MaSach);
    if (sach) {
      sach.SoQuyen += 1;
      await sach.save();
    }

    res.json({ message: "Sách đã được trả", muonSach: updatedMuonSach });
  } catch (error) {
    console.error("Error returning loaned book:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái trả sách" });
  }
});

// Từ chối yêu cầu mượn sách (chỉ admin)
router.put("/reject/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const id = req.params.id;

    // Lấy yêu cầu mượn sách hiện tại
    const currentMuonSach = await TheoDoiMuonSach.findById(id);

    // Kiểm tra xem yêu cầu mượn sách có tồn tại và trạng thái hiện tại có phải là "Chờ duyệt" hay không
    if (!currentMuonSach) {
      return res.status(404).json({ message: ERROR.LOAN_REQUEST_NOT_FOUND });
    }

    if (currentMuonSach.TrangThai !== LOAN_STATUS.PENDING) {
      return res.status(400).json({
        message: `Chỉ có thể từ chối các yêu cầu mượn sách đang ở trạng thái ${LOAN_STATUS.PENDING}`,
      });
    }

    // Cập nhật trạng thái thành "Từ chối"
    const updatedMuonSach = await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      { TrangThai: LOAN_STATUS.REJECTED },
      { new: true }
    );

    res.json({
      message: "Yêu cầu mượn sách đã bị từ chối",
      muonSach: updatedMuonSach,
    });
  } catch (error) {
    console.error("Error rejecting loan request:", error);
    res.status(500).json({ message: "Lỗi khi từ chối yêu cầu mượn sách" });
  }
});

// Sửa thông tin bản ghi mượn sách (chỉ admin)
router.put("/edit/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // Dữ liệu mới từ request body

    const updatedMuonSach = await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedMuonSach) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi mượn sách" });
    }

    res.json({
      message: "Thông tin bản ghi mượn sách đã được cập nhật",
      muonSach: updatedMuonSach,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi sửa bản ghi mượn sách" });
  }
});

// Xóa bản ghi mượn sách (chỉ admin)
router.delete("/delete/:id", auth([ROLES.ADMIN]), async (req, res) => {
  try {
    await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
    res.json({ message: "Bản ghi mượn sách đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bản ghi mượn sách" });
  }
});

module.exports = router;
