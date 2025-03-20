import axios from "axios";
import { ref } from 'vue';

export const records = ref([]);

const apiBase = "http://localhost:5000/api/muonsach";

export const fetchRecords = async () => {
  try {
    const response = await axios.get(apiBase);
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};

export const approveRequest = async (id) => {
  try {
    await axios.put(`${apiBase}/approve/${id}`);
    alert("Đơn mượn sách đã được duyệt");
  } catch (error) {
    console.error("Error approving request:", error);
    alert(error.response.data.message);

  }
};

export const markReturned = async (id) => {
  try {
    await axios.put(`${apiBase}/return/${id}`);
    alert("Đơn mượn sách đã được cập nhật thành 'Đã trả'");
  } catch (error) {
    console.error("Error marking as returned:", error);
    alert(error.response.data.message);

  }
};

export const deleteRecord = async (id) => {
  try {
    await axios.delete(`${apiBase}/delete/${id}`);
    alert("Đơn mượn sách đã được xóa");
  } catch (error) {
    console.error("Error deleting record:", error);
    alert(error.response.data.message);

  }
};


// Hàm thêm yêu cầu mượn sách
export const addRequest = async (newRequest) => {
  try {
    // Tìm mã sách từ tên sách
    const book = await axios.get(`http://localhost:5000/api/sach/timkiem/tensach?TenSach=${newRequest.TenSach}`);
    const bookId = book.data[0]?._id;
    if (!bookId) {
      alert("Không tìm thấy sách với tên đã nhập");
      return;
    }

    // Tìm mã độc giả từ tên độc giả
    const docgia = await axios.get(`http://localhost:5000/api/docgia/timkiem/ten?Ten=${newRequest.TenDocGia}`);
    const docgiaId = docgia.data[0]?._id;
    if (!docgiaId) {
      alert("Không tìm thấy độc giả với tên đã nhập");
      return;
    }

    // Cập nhật mã sách và mã độc giả vào yêu cầu mới
    const requestData = {
      MaSach: bookId,
      MaDocGia: docgiaId,
      NgayMuon: newRequest.NgayMuon,
      NgayTra: newRequest.NgayTra,
    };

    // Gửi yêu cầu tạo đơn mượn sách
    await axios.post(`${apiBase}/request`, requestData);
    alert("Đơn mượn sách mới đã được thêm thành công");
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data.message); // Hiển thị thông báo từ API
      return;
    }
    console.error("Error adding request:", error);
    alert(error.response.data.message);
  }
};



export const updateRequest = async (id, requestData) => {
  try {
      await axios.put(`${apiBase}/edit/${id}`, requestData);
      alert("Thông tin đơn mượn sách đã được cập nhật thành công");
  } catch (error) {
      console.error("Error updating request:", error);
      alert(error.response.data.message);
  }
};
