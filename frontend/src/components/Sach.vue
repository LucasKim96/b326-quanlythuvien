<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="table-container">
    <div class="header">
      <h2 class="section-title">Quản lý sách</h2>
      <button class="add-book-button" @click="openAddBookForm">Thêm sách</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Giá sách</th>
          <th>Số quyển</th>
          <th>Quản lý</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.TenSach }}</td>
          <td>{{ book.TacGia }}</td>
          <td>{{ book.DonGia }}</td>
          <td>{{ book.SoQuyen }}</td>
          <td>
            <a href="#" @click.prevent="openEditForm(book)" class="edit-link">Edit</a>
            <a href="#" class="delete-link" @click.prevent="deleteBookData(book)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form chỉnh sửa sách -->
    <div v-if="isEditModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chỉnh sửa thông tin sách</h3>
        <form @submit.prevent="updateBookData">
          <label>
            Tên sách:
            <input v-model="editBook.TenSach" type="text" required />
          </label>
          <label>
            Tác giả:
            <input v-model="editBook.TacGia" type="text" required />
          </label>
          <label>
            Giá sách:
            <input v-model="editBook.DonGia" type="number" required />
          </label>
          <label>
            Số quyển:
            <input v-model="editBook.SoQuyen" type="number" required />
          </label>
          <label>
            Năm xuất bản:
            <input v-model="editBook.NamXuatBan" type="number" required />
          </label>
          <label>
            Nhà xuất bản:
            <input v-model="editBook.TenNXB" type="text" required />
          </label>
          <button type="submit">Cập nhật</button>
          <button @click.prevent="closeEditForm">Hủy</button>
        </form>
      </div>
    </div>
    <div v-if="isAddBookModalOpen" class="add-book-modal">
      <div class="modal-content">
        <h3>Thêm sách mới</h3>
        <form @submit.prevent="addBook">
          <label>
            Tên sách:
            <input v-model="newBook.TenSach" type="text" required />
          </label>
          <label>
            Đơn giá:
            <input v-model="newBook.DonGia" type="number" required />
          </label>
          <label>
            Số quyển:
            <input v-model="newBook.SoQuyen" type="number" required />
          </label>
          <label>
            Tác giả:
            <input v-model="newBook.TacGia" type="text" required />
          </label>
          <label>
            Năm xuất bản:
            <input v-model="newBook.NamXuatBan" type="number" required />
          </label>
          <label>
            Nhà xuất bản:
            <input v-model="newBook.TenNXB" type="text" required />
          </label>
          <button type="submit" @click.prevent="addBookData">Thêm sách</button>
          <button @click.prevent="closeAddBookForm">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { books, fetchBooks, updateBook, addBook, deleteBook  } from "../stores/sach.js";
import { nxbs, fetchNxbs  } from "../stores/nhaxuatban.js";
import { ref, onMounted } from "vue";

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
  NamXuatBan: 0,
  TenNXB: "",
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

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Styles for the "Thêm sách" button */
.add-book-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.add-book-button:hover {
  background-color: #3730a3;
}

/* Styles for the add book modal */
.add-book-modal {
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

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.modal-content h3 {
  margin-bottom: 10px;
}

.modal-content form label {
  display: block;
  margin: 10px 0;
}

.modal-content form button {
  margin-right: 10px;
}
</style>
