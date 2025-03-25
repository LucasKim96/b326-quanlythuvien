<template>
  <div class="container">
    <!-- Navigation -->
    <NavBar />
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
              <input
                type="password"
                id="Password"
                v-model="editForm.Password"
                :disabled="!isEditing"
              />
            </div>
          </div>
          <div class="action-buttons">
            <button v-if="!isEditing" @click.prevent="enableEditing">
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
import { updatenhanvien } from "@/stores/nhanvien";
import NavBar from "@/components/NavBar.vue";

// Initializing the stores and router
const authStore = useAuthStore();

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
</script>
