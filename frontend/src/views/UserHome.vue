<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <span class="nav-title">Library</span>
        </div>
        <div class="nav-links">
          <input
            v-model="searchQuery"
            @input="searchBooks"
            type="text"
            class="search-bar"
            placeholder="Tìm kiếm sách..."
          />
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
              <tr v-for="book in searchResults" :key="book._id">
                <td>{{ book.TenSach }}</td>
                <td>{{ book.TacGia }}</td>
                <td>{{ book.DonGia }}</td>
                <td>{{ book.SoQuyen }}</td>
                <td>
                  <a href="#" @click.prevent="openAddRequestForm(book)" class="edit-link">Đăng ký</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-results">Không tìm thấy kết quả phù hợp.</p>
        </div>

        <!-- Hiển thị thành phần SachForUser nếu không tìm kiếm -->
        <SachForUser v-else />
      </div>
    </main>
    <div v-if="isAddRequestModalOpen" class="add-request-modal">
        <div class="modal-content">
          <h3>Thêm đơn mượn sách mới</h3>
          <form @submit.prevent="addRequestData">
            <label>
              Tên Sách:
              <input type="text" v-model="newRequest.TenSach" disabled />
            </label>
            <label>
              Tên Độc Giả:
              <input type="text" v-model="newRequest.TenDocGia" disabled />
            </label>
            <label>
              Ngày Mượn:
              <input v-model="newRequest.NgayMuon" type="date" required />
            </label>
            <label>
              Ngày Trả:
              <input v-model="newRequest.NgayTra" type="date" required />
            </label>
            <button type="submit">Thêm đơn mượn</button>
            <button @click.prevent="closeAddRequestForm">Hủy</button>
          </form>
        </div>
      </div>
  </div>
</template>

<script setup>
import SachForUser from "../components/SachForUser.vue";
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { searchBooksByName, searchBooksByAuthor } from "../stores/sach";
import { addRequest } from "../stores/theodoimuonsach";

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);
const searchQuery = ref(""); // Biến lưu trữ từ khóa tìm kiếm
const searchResults = ref([]); // Lưu kết quả tìm kiếm

const isSearching = ref(false); // Trạng thái để kiểm tra người dùng có đang tìm kiếm không

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

// Toggle menu
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Logout
const logout = () => {
  authStore.logout();
  router.push("/");
};
const isAddRequestModalOpen = ref(false);
  const newRequest = ref({
    TenSach: "",
    TenDocGia: authStore.user?.Ten, // Tên độc giả lấy từ thông tin đăng nhập
    NgayMuon: "",
    NgayTra: "",
  });
  
  // Mở form đăng ký mượn sách và điền tự động tên sách
  const openAddRequestForm = (book) => {
    newRequest.value.TenSach = book.TenSach; // Điền tên sách từ book vào form
    newRequest.value.TenDocGia = authStore.user?.Ten || ""; // Lấy tên người dùng từ auth store
    isAddRequestModalOpen.value = true;
  };
  
  // Đóng form thêm đơn mượn
  const closeAddRequestForm = () => {
    isAddRequestModalOpen.value = false;
    newRequest.value = {
      TenSach: "",
      TenDocGia: authStore.user?.Ten || "", // Reset lại tên độc giả
      NgayMuon: "",
      NgayTra: "",
    };
  };
  
  // Thêm đơn mượn sách mới
  const addRequestData = async () => {
    await addRequest(newRequest.value);
    closeAddRequestForm();
  };
</script>

<style>
.no-results {
  color: #9ca3af;
  text-align: center;
  margin-top: 20px;
  font-size: 1rem;
}

.search-bar {
  padding: 0.5rem;
  margin-left: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 200px;
}

.search-bar:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.4);
}

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
.nav-links .nav-link {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
  font-size: 0.875rem;
}
.nav-links .nav-link:hover {
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
.add-request-button {
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  .add-request-button:hover {
    background-color: #3730a3;
  }
  .add-request-modal,
  .detail-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 400px;
  }
  .modal-content h3 {
    margin-top: 0;
  }
  .modal-content form label {
    display: block;
    margin: 10px 0;
  }
  
  .modal-actions button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
  }
</style>
