<template>
  <div class="container bg-light min-vh-100">
    <!-- Navigation -->
    <NavBar />
    <!-- Main Content -->
    <main class="container py-4">
      <h1 class="mb-4 fw-bold text-dark text-uppercase text-center shadow-lg">
        Trang chủ
      </h1>
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
      <Theodoimuonsach />
      <NhanVien />
    </main>
  </div>
</template>

<script setup>
import Theodoimuonsach from "../components/TheoDoiMuonSach.vue";
import NhanVien from "../components/NhanVien.vue";
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

// Dữ liệu thống kê
const stats = ref([
  { name: "Số lượng sách", value: 0 },
  { name: "Số lượng quyển", value: 0 },
  { name: "Sách đang mượn", value: 0 },
  { name: "Số lượng người dùng", value: 0 },
]);

// Lấy dữ liệu từ API
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
