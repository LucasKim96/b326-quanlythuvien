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
    <!-- main content -->
    <main>
      <DonMuonSachForUser />
    </main>
  </div>
</template>

<script setup>
import DonMuonSachForUser from "@/components/DonMuonSachForUser.vue";

import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
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
</script>
