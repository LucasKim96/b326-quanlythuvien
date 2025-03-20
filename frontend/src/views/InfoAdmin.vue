<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <span class="nav-title">Library</span>
        </div>
        <div class="nav-links">
          <RouterLink to="/user-home" class="nav-link">Trang chủ</RouterLink>
          <RouterLink to="/don-muon-sach" class="nav-link"
            >Đơn mượn sách</RouterLink
          >
          <a class="user-info" @click="toggleDropdown">
            Xin chào, {{ authStore.user?.Ten }}
            <div v-if="showDropdown" class="dropdown">
              <button @click.prevent="goToUserInfo">Thông tin tài khoản</button>
              <button @click="logout">Đăng xuất</button>
            </div>
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <div class="account-card">
        <h1 class="section-title">Thông Tin Tài Khoản</h1>
        <form @submit.prevent="handleSave">
          <div class="info-grid">
            <div class="info-item">
              <label for="HoTenNV">Họ tên Nhân viên:</label>
              <input
                id="HoTenNV"
                v-model="editForm.HoTenNV"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-item">
              <label for="ChucVu">Chức vụ:</label>
              <input
                id="ChucVu"
                v-model="editForm.ChucVu"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-item">
              <label for="DiaChi">Địa chỉ:</label>
              <input
                id="DiaChi"
                v-model="editForm.DiaChi"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-item">
              <label for="SoDienThoai">Số Điện Thoại:</label>
              <input
                id="SoDienThoai"
                v-model="editForm.SoDienThoai"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-item">
              <label for="Password">Đổi mật khẩu:</label>
              <input type="password"
                id="Password"
                v-model="editForm.Password"
                :disabled="!isEditing"
              />
            </div>
          </div>
          <div class="action-buttons">
            <button
              v-if="!isEditing"
              @click.prevent="enableEditing"
            >
              Chỉnh sửa
            </button>
            <button v-else type="submit" class="action-buttons">Lưu</button>
            <button
              v-if="isEditing"
              @click.prevent="cancelEditing"
              class="action-buttons"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { updatenhanvien } from "@/stores/nhanvien";

// Initializing the stores and router
const authStore = useAuthStore();
const router = useRouter();

// Dropdown visibility state
const showDropdown = ref(false);

const goToUserInfo = () => {
  router.push("/info-user");
};

// Trạng thái chỉnh sửa
const isEditing = ref(false);

// Form chỉnh sửa (bắt đầu với dữ liệu của người dùng)
const editForm = ref({
  HoTenNV: authStore.user?.HoTenNV || "",
  ChucVu: authStore.user?.ChucVu || "",
  DiaChi: authStore.user?.DiaChi || "",
  SoDienThoai: authStore.user?.SoDienThoai || "",
  Password: "",
});

// Bật chế độ chỉnh sửa
const enableEditing = () => {
  isEditing.value = true;
};

// Hủy chỉnh sửa
const cancelEditing = () => {
  isEditing.value = false;
  editForm.value = {
    HoTenNV: authStore.user?.HoTenNV || "",
    ChucVu: authStore.user?.ChucVu || "",
    DiaChi: authStore.user?.DiaChi || "",
    SoDienThoai: authStore.user?.SoDienThoai || "",
    Password: "",
  };
};

// Lưu thông tin
const handleSave = async () => {
  try {
    await updatenhanvien(authStore.user, editForm.value);
    alert("Cập nhật thông tin thành công!");
    authStore.user = { ...authStore.user, ...editForm.value }; // Cập nhật lại thông tin người dùng trong store
    isEditing.value = false;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    alert("Có lỗi xảy ra khi cập nhật thông tin.");
  }
};

// Function to toggle the dropdown menu
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Function to handle logout and redirect
const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.container {
  background-color: #f7fafc;
  min-height: 100vh;
}

/* Navbar styling */
.navbar {
  background-color: #000000;
  color: white;
  padding: 1rem;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  max-width: 1024px;
  margin: 0 auto;
}
.nav-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-links a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
  font-size: 0.875rem;
}
.nav-links a:hover {
  background-color: #3869ca;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

/* Dropdown menu */
.user-info {
  position: relative;
  cursor: pointer;
}
.dropdown {
  position: absolute;
  right: 0;
  top: 30px;
  background-color: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 10px 0;
}
.dropdown button {
  width: 100%;
  background-color: transparent;
  color: #333;
  padding: 10px;
  cursor: pointer;
  border: none;
}
.dropdown button:hover {
  background-color: #f0f0f0;
}

/* Main content */
.main-content {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Account card styling */
.account-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item label {
  flex: 1;
  font-weight: bold;
  color: #1f2937;
}

.info-item input {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3730a3;
}
</style>
