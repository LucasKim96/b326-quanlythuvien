<template>
    <div class="container">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-left">
            <span class="nav-title">Library Admin</span>
          </div>
          <div class="nav-links">
            <RouterLink to="/admin-home" class="nav-link">Trang chủ</RouterLink>
            <RouterLink to="/quan-ly-sach" class="nav-link"
              >Quản lý Sách</RouterLink
            >
            <RouterLink to="/quan-ly-doc-gia" class="nav-link"
              >Quản lý Độc giả</RouterLink
            >
            <RouterLink to="/quan-ly-muon-sach" class="nav-link"
              >Quản lý Mượn sách</RouterLink
            >
            <RouterLink to="/quan-ly-nxb" class="nav-link"
              >Quản lý NXB</RouterLink
            >
            <RouterLink to="/quan-ly-nhan-vien" class="nav-link">Quản lý Nhân viên</RouterLink>
            <a class="user-info" @click="toggleDropdown">
              Xin chào, {{ authStore.user?.HoTenNV }}
              <div v-if="showDropdown" class="dropdown">
                <button @click.prevent="goToAdminInfo">Thông tin tài khoản</button>
                <button @click="logout">Đăng xuất</button>
              </div>
            </a>
          </div>
        </div>
      </nav>
      <main>
        <NhanVien />
      </main>
    </div>
  </template>
  
  <script setup>
  import NhanVien from "../components/NhanVien.vue";
  import { ref } from "vue";
  import { useAuthStore } from "../stores/auth";
  import { useRouter } from "vue-router";
  
  // Initializing the stores and router
  const authStore = useAuthStore();
  const router = useRouter();
  
  const goToAdminInfo = () => {
      router.push("/info-admin"); // Đảm bảo route có tên là 'InfoAdmin'
  }
  // Dropdown visibility state
  const showDropdown = ref(false);
  
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
  
  <style>
  .container {
    background-color: #f7fafc;
    min-height: 100vh;
  }
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
  .main-content {
    max-width: 1024px;
    margin: 2rem auto;
    padding: 1rem;
  }
  .section-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  .stat-box {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .stat-name {
    font-size: 0.875rem;
    color: #6b7280;
  }
  .stat-value {
    font-size: 1.875rem;
    font-weight: bold;
    color: #1f2937;
  }
  .section {
    margin-top: 2rem;
  }
  .table-container {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  .table th,
  .table td {
    padding: 0.95rem;
    text-align: left;
  }
  .table thead {
    background-color: #f9fafb;
  }
  .table tbody tr:nth-child(even) {
    background-color: #f3f4f6;
  }
  .edit-link {
    color: #4f46e5;
    margin-right: 0.5rem;
  }
  .edit-link:hover {
    color: #3730a3;
  }
  .delete-link {
    color: #e11d48;
  }
  .delete-link:hover {
    color: #9f1239;
  }
  .status-returned {
    background-color: #d1fae5;
    color: #065f46;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
  }
  .status-pending {
    background-color: #fef3c7;
    color: #92400e;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
  }
  .manage-link {
    color: #4f46e5;
  }
  .manage-link:hover {
    color: #3730a3;
  }
  
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
  
  .dropdown p {
    margin: 0;
    padding: 10px;
    border-bottom: 1px solid #ddd;
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
  </style>
  