import axios from "axios";
import { ref } from "vue";

export const docgias = ref([]); // Store danh sách độc giả

// Hàm lấy danh sách độc giả từ server
export const fetchDocGias = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/docgia");
    docgias.value = response.data;
  } catch (error) {
    console.error("Error fetching docgias:", error);
    alert(error.response.data.message);

  }
};

// Hàm thêm độc giả mới
export const addDocGia = async (newDocGia) => {
  try {
    await axios.post("http://localhost:5000/api/docgia/add", newDocGia);
    await fetchDocGias();
  } catch (error) {
    console.error("Error adding docgia:", error);
    alert(error.response.data.message);

  }
};

// Hàm cập nhật thông tin độc giả
export const updateDocGia = async (updatedDocGia, formvalue) => {
  try {
    await axios.put(`http://localhost:5000/api/docgia/edit/${updatedDocGia._id}`, formvalue);
    await fetchDocGias();
  } catch (error) {
    console.error("Error updating docgia:", error);
    alert(error.response.data.message);

  }
};

// Hàm xóa độc giả
export const deleteDocGia = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/docgia/delete/${id}`);
    await fetchDocGias();
  } catch (error) {
    console.error("Error deleting docgia:", error);
    alert(error.response.data.message);

  }
};
