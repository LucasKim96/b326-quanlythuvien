<template>
  <div class="table-container">
    <div class="header">
      <h2 class="section-title">Thư viện</h2>
    </div>
    <table class="table">
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
        <tr v-for="book in books" :key="book.id">
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

    <!-- Form đăng ký mượn sách -->
    <div v-if="isAddRequestModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Thêm đơn mượn sách mới</h3>
        <form @submit.prevent="addRequestData" class="form-container">
          <div class="form-group">
            <label>
              Tên Sách:
              <input type="text" v-model="newRequest.TenSach" disabled />
            </label>
          </div>
          <div class="form-group">
            <label>
              Tên Độc Giả:
              <input type="text" v-model="newRequest.TenDocGia" disabled />
            </label>
          </div>
          <div class="form-group">
            <label>
              Ngày Mượn:
              <input v-model="newRequest.NgayMuon" type="date" required />
            </label>
          </div>
          <div class="form-group">
            <label>
              Ngày Trả:
              <input v-model="newRequest.NgayTra" type="date" required />
            </label>
          </div>
          <div class="form-actions">
            <button type="submit">Thêm đơn mượn</button>
            <button @click.prevent="closeAddRequestForm">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { books, fetchBooks } from "../stores/sach.js";
import { ref, onMounted } from "vue";
import { addRequest } from "../stores/theodoimuonsach";
import { useAuthStore } from "../stores/auth"; // Import auth store để lấy thông tin người dùng

const authStore = useAuthStore(); // Sử dụng store để lấy thông tin đăng nhập người dùng
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

onMounted(() => {
  fetchBooks();
});
</script>
