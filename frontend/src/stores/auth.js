// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    role: localStorage.getItem("role") || null
  }),

  actions: {
    // Hàm login
    async login(credentials) {
      try {
        console.log("Starting login process");
        const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
        
        console.log("Login response:", response.data);

        this.token = response.data.token;
        this.user = response.data.user;
        this.role = response.data.user.Role;

        // Lưu vào localStorage
        localStorage.setItem("token", this.token);
        localStorage.setItem("role", this.role);
        localStorage.setItem("user", JSON.stringify(this.user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        console.log("User updated:", this.user);
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert(error.response.data.message);
      }
    },

    // Hàm register
    async register(data) {
      try {
        await axios.post("http://localhost:5000/api/auth/register", data);
        await this.login({ SoDienThoai: data.SoDienThoai, Password: data.Password });
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        alert(error.response.data.message);
      }
    },

    // Hàm logout
    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user"); // Xóa thông tin user khỏi localStorage
      delete axios.defaults.headers.common["Authorization"];
    },

    // Kiểm tra và lấy thông tin người dùng nếu có token
    async fetchUserIfTokenExists() {
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        try {
          const response = await axios.get("http://localhost:5000/api/auth/me"); 
          this.user = response.data.user;
          this.role = response.data.user.Role;

          // Cập nhật role và user vào localStorage
          localStorage.setItem("role", this.role);
          localStorage.setItem("user", JSON.stringify(this.user));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          this.logout(); // Xóa token nếu không hợp lệ và chuyển hướng đăng nhập
          alert(error.response.data.message);
        }
      }
    }
  }
});

// Interceptor xử lý lỗi 401 toàn cục
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      const router = useRouter();
      router.push("/login"); // Chuyển hướng về trang đăng nhập nếu token hết hạn
    }
    return Promise.reject(error);
  }
);
