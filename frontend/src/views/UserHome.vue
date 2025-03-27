<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg bg-primary px-3">
      <RouterLink class="navbar-brand" to="/user-home">THƯ VIỆN</RouterLink>
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
    <!-- Main Content -->
    <main class="main-content">
      <div class="dashboard">
        <!-- Hiển thị kết quả tìm kiếm hoặc thông báo nếu đang tìm kiếm -->
        <div v-if="isSearching">
          <table v-if="searchResults.length > 0" class="table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Giá sách</th>
                <th>Số quyển</th>
                <th>Mượn sách</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in searchResults" :key="book.id">
                <td>{{ book.TenSach }}</td>
                <td>{{ book.TacGia }}</td>
                <td>{{ book.DonGia }}</td>
                <td>{{ book.SoQuyen }}</td>
                <td>
                  <a
                    href="#"
                    @click.prevent="openAddRequestForm(book)"
                    class="edit-link"
                  >
                    <i class="fas fa-sign-in-alt"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-results">Không tìm thấy kết quả phù hợp.</p>
        </div>
        <!-- Hiển thị thành phần SachForUser nếu không tìm kiếm -->
        <SachForUser v-else />
      </div>
      <!-- Form đăng ký mượn sách -->
      <div v-if="isAddRequestModalOpen" class="add-modal">
        <div class="modal-content">
          <h3>Thêm đơn mượn sách mới</h3>
          <form @submit.prevent="addRequestData" class="form-container">
            <div class="form-group">
              <label> Tên Sách: </label
              ><input type="text" v-model="newRequest.TenSach" disabled />
            </div>
            <div class="form-group">
              <label> Tên Độc Giả: </label
              ><input type="text" v-model="newRequest.TenDocGia" disabled />
            </div>
            <div class="form-group">
              <label> SĐT Độc Giả: </label
              ><input type="text" v-model="newRequest.SoDienThoai" disabled />
            </div>
            <div class="form-group">
              <label> Ngày Mượn: </label
              ><input v-model="newRequest.NgayMuon" type="date" required />
            </div>
            <div class="form-group">
              <label> Ngày Trả: </label
              ><input v-model="newRequest.NgayTra" type="date" required />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Thêm đơn mượn</button>
              <button
                @click.prevent="closeAddRequestForm"
                class="btn-secondary"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import SachForUser from "../components/SachForUser.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { searchBooksByName, searchBooksByAuthor } from "../stores/sach";
import { useRoute } from "vue-router";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fetchBooks } from "../stores/sach.js";
import { addRequest } from "../stores/theodoimuonsach";
library.add(faEdit, faTrashAlt);

const router = useRouter();
const showDropdown = ref(false);
const route = useRoute();
const searchQuery = ref("");

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

const authStore = useAuthStore();
const searchResults = ref([]); // Lưu kết quả tìm kiếm
const isSearching = ref(false); // Trạng thái để kiểm tra người dùng có đang tìm kiếm không
const isAddRequestModalOpen = ref(false);
const newRequest = ref({
  TenSach: "",
  TenDocGia: authStore.user?.Ten, // Tên độc giả lấy từ thông tin đăng nhập
  SoDienThoai: authStore.user?.SoDienThoai,
  NgayMuon: "",
  NgayTra: "",
});

// Mở form đăng ký mượn sách và điền tự động tên sách
const openAddRequestForm = (book) => {
  newRequest.value.TenSach = book.TenSach; // Điền tên sách từ book vào form
  newRequest.value.TenDocGia = authStore.user?.Ten || ""; // Lấy tên người dùng từ auth store
  newRequest.value.SoDienThoai = authStore.user?.SoDienThoai || "";
  isAddRequestModalOpen.value = true;
};

// Đóng form thêm đơn mượn
const closeAddRequestForm = () => {
  isAddRequestModalOpen.value = false;
  newRequest.value = {
    TenSach: "",
    TenDocGia: authStore.user?.Ten || "", // Reset lại tên độc giả
    SoDienThoai: authStore.user?.SoDienThoai || "",
    NgayMuon: "",
    NgayTra: "",
  };
};

// Thêm đơn mượn sách mới
const addRequestData = async () => {
  await addRequest(newRequest.value);
  closeAddRequestForm();
};

onMounted(() => {
  fetchBooks();
});
</script>
