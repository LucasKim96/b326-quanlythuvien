<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="table-container">
    <div class="header">
      <div class="header-left"><h2 class="section-title">Quản lý sách</h2></div>
      <div class="header-right">
        <button class="add-button" @click="openAddBookForm">Thêm sách</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Giá sách (VND)</th>
          <th>Số quyển</th>
          <th>Tổng số</th>
          <th>Quản lý</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book._id">
          <td>{{ book.TenSach }}</td>
          <td>{{ book.TacGia }}</td>
          <td>{{ book.DonGia }}</td>
          <td>{{ book.SoQuyen }}</td>
          <td>
            {{ book.tongso }}
          </td>
          <td>
            <font-awesome-icon
              icon="fa-edit"
              @click.prevent="openEditForm(book)"
              class="edit-icon"
              style="cursor: pointer; margin-right: 10px"
            />
            <font-awesome-icon
              icon="fa-trash-alt"
              @click.prevent="deleteBookData(book._id)"
              class="delete-icon"
              style="cursor: pointer; color: red"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form chỉnh sửa sách -->
    <div v-if="isEditModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chỉnh sửa thông tin sách</h3>
        <form @submit.prevent="updateBookData" class="form-container">
          <div class="form-group">
            <label> Tên sách: </label
            ><input v-model="editBook.TenSach" type="text" required />
          </div>
          <div class="form-group">
            <label> Tác giả: </label
            ><input v-model="editBook.TacGia" type="text" required />
          </div>
          <div class="form-group">
            <label> Giá sách: (VND)</label
            ><input v-model="editBook.DonGia" type="number" required />
          </div>
          <div class="form-group">
            <label> Số quyển: </label
            ><input v-model="editBook.SoQuyen" type="number" required />
          </div>
          <div class="form-group">
            <label> Năm xuất bản: </label
            ><input v-model="editBook.NamXuatBan" type="number" required />
          </div>
          <div class="form-group">
            <label> Nhà xuất bản: </label
            ><input v-model="editBook.TenNXB" type="text" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Cập nhật</button>
            <button @click.prevent="closeEditForm" class="btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- form thêm sách mới  -->
    <div v-if="isAddBookModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Thêm sách mới</h3>
        <form @submit.prevent="addBookData" class="form-container">
          <div class="form-group">
            <label> Tên sách: </label
            ><input v-model="newBook.TenSach" type="text" required />
          </div>
          <div class="form-group">
            <label> Đơn giá: </label
            ><input v-model="newBook.DonGia" type="number" required />
          </div>
          <div class="form-group">
            <label> Số quyển: </label
            ><input v-model="newBook.SoQuyen" type="number" required />
          </div>
          <div class="form-group">
            <label> Tác giả: </label
            ><input v-model="newBook.TacGia" type="text" required />
          </div>
          <div class="form-group">
            <label> Năm xuất bản: </label
            ><input v-model="newBook.NamXuatBan" type="number" required />
          </div>
          <div class="form-group">
            <label> Nhà xuất bản: </label>
            <select v-model="newBook.MaNXB" required>
              <option value="" disabled selected>Chọn nhà xuất bản</option>
              <option
                v-for="publisher in nxbs"
                :key="publisher._id"
                :value="publisher._id"
              >
                {{ publisher.TenNXB }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Thêm sách</button>
            <button @click.prevent="closeAddBookForm" class="btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  books,
  fetchBooks,
  updateBook,
  addBook,
  deleteBook,
} from "../stores/sach.js";
import { nxbs, fetchNxbs } from "../stores/nhaxuatban.js";
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faEdit, faTrashAlt);

const isEditModalOpen = ref(false);
const editBook = ref({});

const openEditForm = (book) => {
  editBook.value = { ...book }; // Sao chép thông tin sách vào biến tạm để chỉnh sửa
  isEditModalOpen.value = true;
  const nxb = nxbs.value.find((nxb) => nxb._id === book.MaNXB);
  if (nxb) {
    editBook.value.TenNXB = nxb.TenNXB;
  }
};

const closeEditForm = () => {
  isEditModalOpen.value = false;
};

// Hàm cập nhật sách
const updateBookData = async () => {
  await updateBook(editBook.value); // Gọi hàm cập nhật trong store
  closeEditForm(); // Đóng modal sau khi cập nhật
  await fetchBooks(); // Làm mới danh sách sách sau khi cập nhật
};

const isAddBookModalOpen = ref(false);
const newBook = ref({
  TenSach: "",
  TacGia: "",
  DonGia: 0,
  SoQuyen: 0,
  NamXuatBan: 2000,
  MaNXB: "",
});

// Hàm mở modal thêm sách
const openAddBookForm = () => {
  isAddBookModalOpen.value = true;
};

// Hàm đóng modal thêm sách
const closeAddBookForm = () => {
  isAddBookModalOpen.value = false;
};

// Hàm thêm sách mới
const addBookData = async () => {
  console.log("newbook", newBook.value);
  await addBook(newBook.value); // Gọi hàm thêm sách trong store
  closeAddBookForm(); // Đóng modal sau khi thêm
  fetchBooks(); // Làm mới danh sách sách sau khi thêm
};

const deleteBookData = async (id) => {
  if (confirm("Bạn có chắc muốn xóa sách này không?")) {
    await deleteBook(id);
    await fetchBooks();
  }
};

// Đảm bảo fetchBooks được gọi khi component được mount
onMounted(() => {
  fetchBooks();
  fetchNxbs();
});
</script>
