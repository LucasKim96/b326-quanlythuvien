<template>
  <div class="container-fluid bg-light min-vh-100">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a class="navbar-brand" href="#">Library Admin</a>
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
            <RouterLink class="nav-link" to="/admin-home">Trang chủ</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/quan-ly-sach"
              >Quản lý Sách</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/quan-ly-doc-gia"
              >Quản lý Độc giả</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/quan-ly-muon-sach"
              >Quản lý Mượn sách</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/quan-ly-nxb"
              >Quản lý NXB</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/quan-ly-nhan-vien"
              >Quản lý Nhân viên</RouterLink
            >
          </li>
        </ul>
        <div class="dropdown">
          <button
            class="btn btn-outline-light dropdown-toggle"
            @click="toggleDropdown"
          >
            <i class="fas fa-user"></i> Xin chào, {{ authStore.user?.HoTenNV }}
          </button>
          <ul v-if="showDropdown" class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" @click.prevent="goToAdminInfo"
                ><i class="fas fa-user-circle"></i> Thông tin tài khoản</a
              >
            </li>
            <li>
              <a class="dropdown-item text-danger" @click="logout"
                ><i class="fas fa-sign-out-alt"></i> Đăng xuất</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container py-4">
      <h1 class="mb-4">Trang chủ</h1>
      <div class="row g-3">
        <div v-for="stat in stats" :key="stat.name" class="col-md-3">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title">{{ stat.name }}</h5>
              <p class="display-5 text-primary">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>
      <Sach />
      <Docgia />
      <Theodoimuonsach />
      <NhaXuatBan />
      <NhanVien />
    </main>
  </div>
</template>

<script setup>
import Sach from "../components/Sach.vue";
import Docgia from "../components/DocGia.vue";
import Theodoimuonsach from "../components/TheoDoiMuonSach.vue";
import NhaXuatBan from "../components/NhaXuatBan.vue";
import NhanVien from "../components/NhanVien.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import axios from "axios";

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);
const toggleDropdown = () => (showDropdown.value = !showDropdown.value);
const goToAdminInfo = () => router.push("/info-admin");
const logout = () => {
  authStore.logout();
  router.push("/");
};
const stats = ref([
  { name: "Số lượng sách", value: 0 },
  { name: "Số lượng quyển", value: 0 },
  { name: "Sách đang mượn", value: 0 },
  { name: "Số lượng người dùng", value: 0 },
]);
const fetchStats = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/stats");
    stats.value = [
      { name: "Số lượng sách", value: response.data.totalBooks },
      { name: "Số lượng quyển", value: response.data.totalCopies },
      { name: "Sách đang mượn", value: response.data.booksOnLoan },
      { name: "Số lượng người dùng", value: response.data.activeUsers },
    ];
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

onMounted(fetchStats);
</script>

<style>
.dropdown-menu {
  min-width: 200px;
}
</style>
