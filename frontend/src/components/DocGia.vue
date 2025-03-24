<template>
  <div class="table-container">
    <div class="header">
      <div class="header-left">
        <h2 class="section-title">Quản lý Độc Giả</h2>
      </div>
      <div class="header-right">
        <button class="btn-primary add-button" @click="openAddDocGiaForm">
          Thêm Độc Giả
        </button>
      </div>
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
            <font-awesome-icon
              icon="fa-edit"
              @click.prevent="openEditForm(docgia)"
              class="edit-icon"
              style="cursor: pointer; margin-right: 10px"
            />
            <font-awesome-icon
              icon="fa-trash-alt"
              @click.prevent="deleteDocGiaData(docgia._id)"
              class="delete-icon"
              style="cursor: pointer; color: red"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- form chỉnh sửa thông tin độc giả -->
    <div v-if="isEditModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chỉnh sửa thông tin Độc Giả</h3>
        <form @submit.prevent="updateDocGiaData">
          <div class="form-container">
            <div class="form-group">
              <label>Họ Lót:</label>
              <input v-model="editDocGia.HoLot" type="text" required />
            </div>
            <div class="form-group">
              <label>Tên:</label>
              <input v-model="editDocGia.Ten" type="text" required />
            </div>
            <div class="form-group">
              <label>Ngày Sinh:</label>
              <input v-model="editDocGia.NgaySinh" type="date" required />
            </div>
            <div class="form-group">
              <label>Phái:</label>
              <select v-model="editDocGia.Phai" required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div class="form-group">
              <label>Địa Chỉ:</label>
              <input v-model="editDocGia.DiaChi" type="text" required />
            </div>
            <div class="form-group">
              <label>Số Điện Thoại:</label>
              <input v-model="editDocGia.SoDienThoai" type="text" required />
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

    <!-- forn thêm độc giả mới -->
    <div v-if="isAddDocGiaModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Thêm Độc Giả Mới</h3>
        <form @submit.prevent="addDocGiaData" class="form-container">
          <div class="form-group">
            <label for="ho-lot">Họ Lót:</label>
            <input id="ho-lot" v-model="newDocGia.HoLot" type="text" required />
          </div>

          <div class="form-group">
            <label for="ten">Tên:</label>
            <input id="ten" v-model="newDocGia.Ten" type="text" required />
          </div>

          <div class="form-group">
            <label for="ngay-sinh">Ngày Sinh:</label>
            <input
              id="ngay-sinh"
              v-model="newDocGia.NgaySinh"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="phai">Phái:</label>
            <select id="phai" v-model="newDocGia.Phai" required>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div class="form-group">
            <label for="dia-chi">Địa Chỉ:</label>
            <input
              id="dia-chi"
              v-model="newDocGia.DiaChi"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="so-dt">Số Điện Thoại:</label>
            <input
              id="so-dt"
              v-model="newDocGia.SoDienThoai"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Mật Khẩu:</label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="newDocGia.Password"
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
            <button type="submit" class="btn-primary">Thêm Độc Giả</button>
            <button @click.prevent="closeAddDocGiaForm" class="btn-secondary">
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
import "@/assets/main.css";
import {
  docgias,
  fetchDocGias,
  addDocGia,
  updateDocGia,
  deleteDocGia,
} from "../stores/docgia.js";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faEdit, faTrashAlt);

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
  Password: "",
});

const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

const openEditForm = (docgia) => {
  editDocGia.value = { ...docgia, NgaySinh: formatDate(docgia.NgaySinh) }; // Clone data for editing
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

const isPasswordVisible = ref(false);
onMounted(fetchDocGias);
</script>
