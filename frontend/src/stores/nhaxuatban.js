// stores/nhaXuatBan.js
import { ref } from "vue";
import axios from "axios";

// Tạo biến lưu trữ danh sách Nhà Xuất Bản
export const nxbs = ref([]);

// Hàm lấy danh sách Nhà Xuất Bản
export const fetchNxbs = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/nhaxuatban"); // Đường dẫn API lấy danh sách nhà xuất bản
    nxbs.value = response.data; // Cập nhật danh sách nhà xuất bản
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Nhà Xuất Bản:", error);
    alert(error.response.data.message);

  }
};

// Hàm cập nhật thông tin Nhà Xuất Bản
export const updateNxb = async (updatedNxb) => {
  try {
    await axios.put(`http://localhost:5000/api/nhaxuatban/edit/${updatedNxb._id}`, updatedNxb); // Đường dẫn API cập nhật nhà xuất bản
  } catch (error) {
    console.error("Lỗi khi cập nhật Nhà Xuất Bản:", error);
    alert(error.response.data.message);

  }
};

// Hàm thêm Nhà Xuất Bản mới
export const addNxb = async (newNxb) => {
  try {
    await axios.post("http://localhost:5000/api/nhaxuatban/add", newNxb); // Đường dẫn API thêm nhà xuất bản
  } catch (error) {
    console.error("Lỗi khi thêm Nhà Xuất Bản:", error);
    alert(error.response.data.message);

  }
};

export const deleteNxb = async (delNxb) => {
    try {
      await axios.delete(`http://localhost:5000/api/nhaxuatban/delete/${delNxb._id}`, delNxb); // Đường dẫn API thêm nhà xuất bản
    } catch (error) {
      console.error("Lỗi khi xóa Nhà Xuất Bản:", error);
      alert(error.response.data.message);

    }
  };
