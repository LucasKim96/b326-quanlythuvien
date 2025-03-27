<template>
  <div class="table-container">
    <div class="header">
      <div class="header-left">
        <h2 class="section-title">Quản lý Nhân Viên</h2>
      </div>
      <div class="header-right">
        <button class="btn-primary add-button" @click="openAddnhanvienForm">
          Thêm Nhân Viên
        </button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Họ tên nhân viên</th>
          <th>Chức vụ</th>
          <th>Địa Chỉ</th>
          <th>Số Điện Thoại</th>
          <th>Quản lý</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nhanvien in nhanviens" :key="nhanvien._id">
          <td>{{ nhanvien.HoTenNV }}</td>
          <td>{{ nhanvien.ChucVu }}</td>
          <td>{{ nhanvien.DiaChi }}</td>
          <td>{{ nhanvien.SoDienThoai }}</td>
          <td>
            <font-awesome-icon
              icon="fa-edit"
              @click.prevent="openEditForm(nhanvien)"
              class="edit-icon"
              style="cursor: pointer; margin-right: 10px"
            />
            <font-awesome-icon
              icon="fa-trash-alt"
              @click.prevent="deletenhanvienData(nhanvien._id)"
              class="delete-icon"
              style="cursor: pointer; color: red"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form chỉnh sửa nhân viên -->
    <div v-if="isEditModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chỉnh sửa thông tin Nhân Viên</h3>
        <form @submit.prevent="updatenhanvienData">
          <div class="form-container">
            <div class="form-group">
              <label>Họ Tên NV:</label>
              <input v-model="editnhanvien.HoTenNV" type="text" required />
            </div>
            <div class="form-group">
              <label>Chức vụ:</label>
              <input v-model="editnhanvien.ChucVu" type="text" required />
            </div>
            <div class="form-group">
              <label>Địa Chỉ:</label>
              <input v-model="editnhanvien.DiaChi" type="text" required />
            </div>
            <div class="form-group">
              <label>Số Điện Thoại:</label>
              <input v-model="editnhanvien.SoDienThoai" type="text" required />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Cập nhật</button>
              <button @click.prevent="closeEditForm" class="btn-secondary">
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Form thêm nhân viên -->
    <div v-if="isAddnhanvienModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Thêm Nhân Viên Mới</h3>
        <form @submit.prevent="addnhanvienData" class="form-container">
          <div class="form-group">
            <label for="ho-ten-nv">Họ tên NV:</label>
            <input
              id="ho-ten-nv"
              v-model="newnhanvien.HoTenNV"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="chuc-vu">Chức vụ:</label>
            <input
              id="chuc-vu"
              v-model="newnhanvien.ChucVu"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="dia-chi">Địa Chỉ:</label>
            <input
              id="dia-chi"
              v-model="newnhanvien.DiaChi"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="so-dt">Số Điện Thoại:</label>
            <input
              id="so-dt"
              v-model="newnhanvien.SoDienThoai"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Mật Khẩu:</label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="newnhanvien.Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                required
              />
              <span
                @click="isPasswordVisible = !isPasswordVisible"
                class="eye-icon"
              >
                <i
                  :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </span>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">Thêm Nhân Viên</button>
            <button @click.prevent="closeAddnhanvienForm" class="btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  nhanviens,
  fetchnhanviens,
  addnhanvien,
  updatenhanvien,
  deletenhanvien,
} from "../stores/nhanvien.js";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faEdit, faTrashAlt);

const isEditModalOpen = ref(false);
const editnhanvien = ref({});
const isAddnhanvienModalOpen = ref(false);
const newnhanvien = ref({
  HoTenNV: "",
  ChucVu: "",
  DiaChi: "",
  SoDienThoai: "",
  Password: "",
});

const openEditForm = (nhanvien) => {
  editnhanvien.value = { ...nhanvien }; // Clone data for editing
  isEditModalOpen.value = true;
};

const closeEditForm = () => {
  isEditModalOpen.value = false;
};

const updatenhanvienData = async () => {
  // eslint-disable-next-line no-unused-vars
  const { Password, ...payload } = editnhanvien.value;
  console.log("Dữ liệu gửi lên backend:", payload);

  await updatenhanvien(editnhanvien.value, payload);
  closeEditForm();
  fetchnhanviens();
};

const openAddnhanvienForm = () => {
  isAddnhanvienModalOpen.value = true;
};

const closeAddnhanvienForm = () => {
  isAddnhanvienModalOpen.value = false;
};

const addnhanvienData = async () => {
  await addnhanvien(newnhanvien.value);
  closeAddnhanvienForm();
  fetchnhanviens();
};

const deletenhanvienData = async (id) => {
  if (confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
    await deletenhanvien(id);
    fetchnhanviens();
  }
};
const isPasswordVisible = ref(false);

onMounted(fetchnhanviens);
</script>
