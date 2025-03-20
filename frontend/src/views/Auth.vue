<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="auth-wrapper">
    <h1 style="padding: 40px">LIBRARY VIETNAM</h1>
    <div class="auth-form">
      <h2>{{ isLogin ? "Đăng Nhập" : "Đăng Ký" }}</h2>

      <!-- Form đăng ký / đăng nhập -->
      <form @submit.prevent="handleSubmit">
        <!-- Chỉ hiển thị các trường đăng ký khi ở chế độ đăng ký -->
        <div v-if="!isLogin">
          <input v-model="registerForm.HoLot" placeholder="Họ Lót" required />
          <input v-model="registerForm.Ten" placeholder="Tên" required />
          <input
            v-model="registerForm.NgaySinh"
            type="date"
            placeholder="Ngày Sinh"
            required
          />
          <input
            v-model="registerForm.Phai"
            placeholder="Phái (Nam/Nữ)"
            required
          />
          <input v-model="registerForm.DiaChi" placeholder="Địa chỉ" required />
        </div>

        <!-- Trường nhập số điện thoại (riêng biệt cho đăng nhập và đăng ký) -->
        <input
          v-if="isLogin"
          v-model="loginForm.SoDienThoai"
          placeholder="Số điện thoại"
          required
        />
        <input
          v-else
          v-model="registerForm.SoDienThoai"
          placeholder="Số điện thoại"
          required
        />

        <!-- Trường nhập mật khẩu (riêng biệt cho đăng nhập và đăng ký) -->
        <input
          v-if="isLogin"
          v-model="loginForm.Password"
          type="password"
          placeholder="Mật khẩu"
          required
        />
        <input
          v-else
          v-model="registerForm.Password"
          type="password"
          placeholder="Mật khẩu"
          required
        />

        <button type="submit">{{ isLogin ? "Đăng Nhập" : "Đăng Ký" }}</button>
      </form>

      <!-- Nút chuyển đổi giữa đăng nhập và đăng ký -->
      <button @click="toggleAuthMode" class="switch-auth-mode">
        {{
          isLogin
            ? "Chưa có tài khoản? Đăng ký ngay"
            : "Đã có tài khoản? Đăng nhập"
        }}
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";

const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isLogin = ref(true);

    // Form đăng nhập cho độc giả
    const loginForm = reactive({
      SoDienThoai: "",
      Password: "",
    });

    // Form đăng ký cho độc giả
    const registerForm = reactive({
      HoLot: "",
      Ten: "",
      NgaySinh: "",
      Phai: "",
      DiaChi: "",
      SoDienThoai: "",
      Password: "",
    });

    const toggleAuthMode = () => {
      isLogin.value = !isLogin.value;
    };

    // Xử lý đăng nhập hoặc đăng ký
    const handleSubmit = async () => {
      try {
        if (isLogin.value) {
          await authStore.login(loginForm);
        } else {
          const formattedRegisterForm = {
            ...registerForm,
            NgaySinh: formatDate(registerForm.NgaySinh), // Sử dụng hàm formatDate
          };
          await authStore.register(formattedRegisterForm);
        }

        if (authStore.role === "admin") {
          router.push({ name: "AdminHome" });
        } else if (authStore.role === "user") {
          router.push({ name: "UserHome" });
        }
      } catch (error) {
        console.error("Lỗi trong quá trình xác thực:", error);
      }
    };

    return {
      isLogin,
      loginForm,
      registerForm,
      toggleAuthMode,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-color: #f5f5f5;
}

.auth-form {
  width: 400px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.switch-auth-mode {
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-top: 15px;
}
</style>
