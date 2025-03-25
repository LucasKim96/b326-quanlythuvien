<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="table-container">
    <div class="header">
      <div class="header-left">
        <h2 class="section-title">Quản lý Nhà Xuất Bản</h2>
      </div>
      <div class="header-right">
        <button class="btn-primary add-button" @click="openAddNxbForm">
          Thêm Nhà Xuất Bản
        </button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Mã Nhà Xuất Bản</th>
          <th>Tên Nhà Xuất Bản</th>
          <th>Địa Chỉ</th>
          <th>Quản lý</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nxb in nxbs" :key="nxb.id">
          <td>{{ nxb._id }}</td>
          <td>{{ nxb.TenNXB }}</td>
          <td>{{ nxb.DiaChi }}</td>
          <td>
            <a href="#" @click.prevent="openEditForm(nxb)" class="edit-link"
              >Edit</a
            >
            <a href="#" class="delete-link" @click.prevent="deleteNxbData(nxb)"
              >Delete</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form chỉnh sửa nhà xuất bản -->
    <div v-if="isEditModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chỉnh sửa thông tin Nhà Xuất Bản</h3>
        <form @submit.prevent="updateNxbData">
          <div class="form-container">
            <div class="form-group">
              <label>
                Tên Nhà Xuất Bản:
                <input v-model="editNxb.TenNXB" type="text" required />
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>
              Địa Chỉ:
              <input v-model="editNxb.DiaChi" type="text" />
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Cập nhật</button>
            <button @click.prevent="closeEditForm" class="btn-secondary">
              >Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Form thêm nhà xuất bản mới -->
    <div v-if="isAddNxbModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Thêm Nhà Xuất Bản Mới</h3>
        <form @submit.prevent="addNxbData">
          <label>
            Tên Nhà Xuất Bản:
            <input v-model="newNxb.TenNXB" type="text" required />
          </label>
          <label>
            Địa Chỉ:
            <input v-model="newNxb.DiaChi" type="text" />
          </label>
          <button type="submit">Thêm Nhà Xuất Bản</button>
          <button @click.prevent="closeAddNxbForm">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  nxbs,
  fetchNxbs,
  updateNxb,
  addNxb,
  deleteNxb,
} from "../stores/nhaxuatban.js";

const isEditModalOpen = ref(false);
const editNxb = ref({});

const openEditForm = (nxb) => {
  editNxb.value = { ...nxb }; // Sao chép thông tin nhà xuất bản vào biến tạm để chỉnh sửa
  isEditModalOpen.value = true;
};

const closeEditForm = () => {
  isEditModalOpen.value = false;
};

// Hàm cập nhật nhà xuất bản
const updateNxbData = async () => {
  await updateNxb(editNxb.value); // Gọi hàm cập nhật trong store
  closeEditForm(); // Đóng modal sau khi cập nhật
  await fetchNxbs(); // Làm mới danh sách nhà xuất bản sau khi cập nhật
};

const deleteNxbData = async (id) => {
  if (confirm("Bạn có chắc muốn xóa nhà xuất bản này không?")) {
    await deleteNxb(id);
    await fetchNxbs();
  }
};

const isAddNxbModalOpen = ref(false);
const newNxb = ref({
  TenNXB: "",
  DiaChi: "",
});

// Hàm mở modal thêm nhà xuất bản
const openAddNxbForm = () => {
  isAddNxbModalOpen.value = true;
};

// Hàm đóng modal thêm nhà xuất bản
const closeAddNxbForm = () => {
  isAddNxbModalOpen.value = false;
};

// Hàm thêm nhà xuất bản mới
const addNxbData = async () => {
  await addNxb(newNxb.value); // Gọi hàm thêm nhà xuất bản trong store
  closeAddNxbForm(); // Đóng modal sau khi thêm
  fetchNxbs(); // Làm mới danh sách nhà xuất bản sau khi thêm
};

// Đảm bảo fetchNxbs được gọi khi component được mount
onMounted(() => {
  fetchNxbs();
});
</script>
