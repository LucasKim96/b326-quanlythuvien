<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="auth-wrapper">
    <h1 style="padding: 40px">LIBRARY VIETNAM</h1>
    <div class="auth-form">
      <h2>{{ isLogin ? "Đăng Nhập" : "Đăng Ký" }}</h2>

      <!-- Form đăng ký / đăng nhập -->
      <form @submit.prevent="handleSubmit" class="form-container">
        <div v-if="!isLogin">
          <input v-model="registerForm.HoLot" placeholder="Họ Lót" required />
          <input v-model="registerForm.Ten" placeholder="Tên" required />
          <input
            v-model="registerForm.NgaySinh"
            type="date"
            placeholder="Ngày Sinh"
            required
          />
          <div class="form-group">
            <select v-model="registerForm.Phai" required>
              <option value="" disabled selected>Chọn Phái</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <input v-model="registerForm.DiaChi" placeholder="Địa chỉ" required />
        </div>

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

        <button type="submit" class="btn-primary">
          {{ isLogin ? "Đăng Nhập" : "Đăng Ký" }}
        </button>
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
