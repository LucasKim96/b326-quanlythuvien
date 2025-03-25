<template>
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
          <div class="nav-links">
            <input
              v-model="searchQuery"
              @input="searchBooks"
              type="text"
              class="search-bar form-control me-2"
              placeholder="Tìm kiếm sách..."
            />
          </div>
        </li>
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
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { searchBooksByName, searchBooksByAuthor } from "../stores/sach";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);
const route = useRoute();
const searchQuery = ref("");
const searchResults = ref([]);
const isSearching = ref(false);

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

// Tìm kiếm sách
const searchBooks = async () => {
  isSearching.value = true; // Đánh dấu trạng thái là đang tìm kiếm
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    isSearching.value = false; // Nếu không nhập gì, xóa kết quả tìm kiếm
    return;
  }

  // Thử tìm kiếm theo tên trước
  const resultsByName = await searchBooksByName(searchQuery.value);

  // Nếu không tìm thấy theo tên, tìm kiếm theo tác giả
  if (resultsByName.length === 0) {
    const resultsByAuthor = await searchBooksByAuthor(searchQuery.value);
    searchResults.value = resultsByAuthor;
  } else {
    searchResults.value = resultsByName;
  }
};

// Điều hướng đến thông tin tài khoản
const goToUserInfo = () => {
  router.push("/info-user");
};
</script>
