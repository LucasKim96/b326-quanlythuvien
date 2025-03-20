import axios from "axios";
import { ref } from "vue";
import { useAuthStore } from "./auth";

export const records = ref([]);

export const fetchUserRecords = async () => {
  try {
    const authStore = useAuthStore(); // Lấy thông tin từ store auth
    const userId = authStore.user._id; // Lấy user ID từ người dùng đã đăng nhập

    if (!userId) {
      throw new Error("Không tìm thấy ID người dùng");
    }

    const response = await axios.get(`http://localhost:5000/api/muonsach/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};
