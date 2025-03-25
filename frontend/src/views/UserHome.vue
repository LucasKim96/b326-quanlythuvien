<template>
  <div class="container">
    <!-- Navigation -->
    <NavBarUser />

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
                  <a
                    href="#"
                    @click.prevent="openAddRequestForm(book)"
                    class="edit-link"
                    >Đăng ký</a
                  >
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
  </div>
</template>

<script setup>
import SachForUser from "../components/SachForUser.vue";
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import NavBarUser from "@//components/NavBarUser.vue";
const authStore = useAuthStore();
const searchResults = ref([]); // Lưu kết quả tìm kiếm

const isSearching = ref(false); // Trạng thái để kiểm tra người dùng có đang tìm kiếm không

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
</script>
