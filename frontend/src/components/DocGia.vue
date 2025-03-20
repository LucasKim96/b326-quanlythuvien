<template>
  <div class="table-container">
    <div class="header">
      <h2 class="section-title">Quản lý Độc Giả</h2>
      <button class="add-docgia-button" @click="openAddDocGiaForm">Thêm Độc Giả</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Họ Lót</th>
          <th>Tên</th>
          <th>Ngày Sinh</th>
          <th>Phái</th>
          <th>Địa Chỉ</th>
          <th>Số Điện Thoại</th>
          <th>Quản lý</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="docgia in docgias" :key="docgia._id">
          <td>{{ docgia.HoLot }}</td>
          <td>{{ docgia.Ten }}</td>
          <td>{{ new Date(docgia.NgaySinh).toLocaleDateString() }}</td>
          <td>{{ docgia.Phai }}</td>
          <td>{{ docgia.DiaChi }}</td>
          <td>{{ docgia.SoDienThoai }}</td>
          <td>
            <a href="#" @click.prevent="openEditForm(docgia)" class="edit-link">Edit</a>
            <a href="#" @click.prevent="deleteDocGiaData(docgia._id)" class="delete-link">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form chỉnh sửa độc giả -->
    <div v-if="isEditModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chỉnh sửa thông tin Độc Giả</h3>
        <form @submit.prevent="updateDocGiaData">
          <label>Họ Lót: <input v-model="editDocGia.HoLot" type="text" required /></label>
          <label>Tên: <input v-model="editDocGia.Ten" type="text" required /></label>
          <label>Ngày Sinh: <input v-model="editDocGia.NgaySinh" type="date" required /></label>
          <label>Phái:
            <select v-model="editDocGia.Phai" required>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </label>
          <label>Địa Chỉ: <input v-model="editDocGia.DiaChi" type="text" required /></label>
          <label>Số Điện Thoại: <input v-model="editDocGia.SoDienThoai" type="text" required /></label>
          <button type="submit">Cập nhật</button>
          <button @click.prevent="closeEditForm">Hủy</button>
        </form>
      </div>
    </div>

    <!-- Form thêm độc giả -->
    <div v-if="isAddDocGiaModalOpen" class="add-docgia-modal">
      <div class="modal-content">
        <h3>Thêm Độc Giả Mới</h3>
        <form @submit.prevent="addDocGiaData">
          <label>Họ Lót: <input v-model="newDocGia.HoLot" type="text" required /></label>
          <label>Tên: <input v-model="newDocGia.Ten" type="text" required /></label>
          <label>Ngày Sinh: <input v-model="newDocGia.NgaySinh" type="date" required /></label>
          <label>Phái:
            <select v-model="newDocGia.Phai" required>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </label>
          <label>Địa Chỉ: <input v-model="newDocGia.DiaChi" type="text" required /></label>
          <label>Số Điện Thoại: <input v-model="newDocGia.SoDienThoai" type="text" required /></label>
          <label>Mật Khẩu: <input v-model="newDocGia.Password" type="password" required /></label>
          <button type="submit">Thêm Độc Giả</button>
          <button @click.prevent="closeAddDocGiaForm">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { docgias, fetchDocGias, addDocGia, updateDocGia, deleteDocGia } from "../stores/docgia.js";

const isEditModalOpen = ref(false);
const editDocGia = ref({});
const isAddDocGiaModalOpen = ref(false);
const newDocGia = ref({
  HoLot: "",
  Ten: "",
  NgaySinh: "",
  Phai: "",
  DiaChi: "",
  SoDienThoai: "",
  Password: ""
});

const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

const openEditForm = (docgia) => {
  editDocGia.value = { ...docgia,
    NgaySinh: formatDate(docgia.NgaySinh),
   }; // Clone data for editing
  isEditModalOpen.value = true;
};

const closeEditForm = () => {
  isEditModalOpen.value = false;
};

const updateDocGiaData = async () => {
  await updateDocGia(editDocGia.value);
  closeEditForm();
  fetchDocGias();
};

const openAddDocGiaForm = () => {
  isAddDocGiaModalOpen.value = true;
};

const closeAddDocGiaForm = () => {
  isAddDocGiaModalOpen.value = false;
};

const addDocGiaData = async () => {
  await addDocGia(newDocGia.value);
  closeAddDocGiaForm();
  fetchDocGias();
};

const deleteDocGiaData = async (id) => {
  if (confirm("Bạn có chắc muốn xóa độc giả này không?")) {
    await deleteDocGia(id);
    fetchDocGias();
  }
};

onMounted(fetchDocGias);
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-docgia-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.add-docgia-button:hover {
  background-color: #3730a3;
}
.add-docgia-modal, .edit-modal {
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
.modal-content form button {
  margin-right: 10px;
}
</style>
