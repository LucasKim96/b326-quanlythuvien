<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg bg-primary px-3">
      <RouterLink class="navbar-brand" to="/user-home">Thư Viện</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink
              to="/user-home"
              class="nav-link"
              :class="{ active: route.path === '/user-home' }"
              >Trang chủ</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              to="/don-muon-sach"
              class="nav-link"
              :class="{ active: route.path === '/don-muon-sach' }"
              >Đơn mượn sách</RouterLink
            >
          </li>
        </ul>
        <div class="user-info position-relative">
          <span class="nav-link" @click="toggleDropdown">
            Xin chào, {{ authStore.user?.Ten }}
          </span>
          <div v-if="showDropdown" class="dropdown-menu dropdown-menu-end show">
            <button class="dropdown-item" @click.prevent="goToUserInfo">
              <i class="fas fa-user-circle"></i> Thông tin tài khoản
            </button>
            <button class="dropdown-item text-danger" @click="logout">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
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
              <label for="HoLot">Họ lót:</label>
              <input
                id="HoLot"
                v-model="editForm.HoLot"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-item">
              <label for="Ten">Tên:</label>
              <input id="Ten" v-model="editForm.Ten" :disabled="!isEditing" />
            </div>
            <div class="info-item">
              <label for="NgaySinh">Ngày sinh:</label>
              <input
                id="NgaySinh"
                v-model="editForm.NgaySinh"
                type="date"
                :disabled="!isEditing"
              />
            </div>
            <div class="info-item">
              <label for="Phai">Phái:</label>
              <input id="Phai" v-model="editForm.Phai" :disabled="!isEditing" />
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
            <button
              v-if="!isEditing"
              @click.prevent="enableEditing"
              class="btn-primary"
            >
              Chỉnh sửa
            </button>
            <button v-else type="submit" class="action-buttons btn-primary">
              Lưu
            </button>
            <button
              v-if="isEditing"
              @click.prevent="cancelEditing"
              class="action-buttons btn-secondary"
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
import { useAuthStore } from "../stores/auth";
import { updateDocGia } from "@/stores/docgia";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const router = useRouter();
const showDropdown = ref(false);
const route = useRoute();

// Điều hướng
const logout = () => {
  authStore.logout();
  router.push("/");
};

// Mở/tắt dropdown khi bấm vào nút
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".user-info")) {
    showDropdown.value = false;
  }
};

// Thêm & gỡ sự kiện khi component được mount/unmount
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Điều hướng đến thông tin tài khoản
const goToUserInfo = () => {
  router.push("/info-user");
};

// Initializing the stores and router
const authStore = useAuthStore();

const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

// Trạng thái chỉnh sửa
const isEditing = ref(false);

// Form chỉnh sửa (bắt đầu với dữ liệu của người dùng)
const editForm = ref({
  HoLot: authStore.user?.HoLot || "",
  Ten: authStore.user?.Ten || "",
  NgaySinh: formatDate(authStore.user?.NgaySinh) || "",
  Phai: authStore.user?.Phai || "",
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
    HoLot: authStore.user?.HoLot || "",
    Ten: authStore.user?.Ten || "",
    NgaySinh: formatDate(authStore.user?.NgaySinh) || "",
    Phai: authStore.user?.Phai || "",
    DiaChi: authStore.user?.DiaChi || "",
    SoDienThoai: authStore.user?.SoDienThoai || "",
    Password: "",
  };
};

// Lưu thông tin
const handleSave = async () => {
  try {
    await updateDocGia(authStore.user, editForm.value);
    alert("Cập nhật thông tin thành công!");
    authStore.user = { ...authStore.user, ...editForm.value }; // Cập nhật lại thông tin người dùng trong store
    isEditing.value = false;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    alert("Có lỗi xảy ra khi cập nhật thông tin.");
  }
};
</script>
