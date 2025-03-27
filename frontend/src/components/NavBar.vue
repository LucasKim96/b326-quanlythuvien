<template>
  <nav class="navbar navbar-expand-lg bg-primary px-3">
    <router-link class="navbar-brand" to="/admin-home"
      >Quản Lý Thư Viện</router-link
    >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/admin-home"
            :class="{ active: route.path === '/admin-home' }"
          >
            Trang chủ
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/quan-ly-sach"
            :class="{ active: route.path === '/quan-ly-sach' }"
          >
            Quản lý Sách
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/quan-ly-doc-gia"
            :class="{ active: route.path === '/quan-ly-doc-gia' }"
          >
            Quản lý Độc giả
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/quan-ly-muon-sach"
            :class="{ active: route.path === '/quan-ly-muon-sach' }"
          >
            Quản lý Mượn sách
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/quan-ly-nxb"
            :class="{ active: route.path === '/quan-ly-nxb' }"
          >
            Quản lý NXB
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link"
            to="/quan-ly-nhan-vien"
            :class="{ active: route.path === '/quan-ly-nhan-vien' }"
          >
            Quản lý Nhân viên
          </RouterLink>
        </li>
      </ul>
      <!-- Dropdown User -->
      <div class="user-info position-relative">
        <span @click="toggleDropdown" class="nav-link">
          Xin chào, {{ authStore.user?.HoTenNV }}
        </span>
        <div v-if="showDropdown" class="dropdown-menu show">
          <button class="dropdown-item" @click.prevent="goToAdminInfo">
            <i class="fas fa-user-circle"></i> Thông tin tài khoản
          </button>
          <button class="dropdown-item text-danger" @click="logout">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);

const route = useRoute();

// Điều hướng
const goToAdminInfo = () => router.push("/info-admin");
const logout = () => {
  authStore.logout();
  router.push("/");
};

// Mở/tắt dropdown khi bấm vào nút
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (event) => {
  if (showDropdown.value && !event.target.closest(".user-info")) {
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
</script>
