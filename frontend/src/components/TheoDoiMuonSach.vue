<template>
  <div class="table-container">
    <div class="header">
      <div class="header-left">
        <h2 class="section-title">Quản lý mượn sách</h2>
      </div>
      <div class="header-right">
        <button class="btn-primary add-button" @click="openAddRequestForm">
          Thêm đơn mượn sách
        </button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Số điện thoại độc giả</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Quản lý</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record._id">
          <td>{{ record.MaSach.TenSach }}</td>
          <td>{{ record.MaDocGia.SoDienThoai }}</td>
          <td>{{ formatDate(record.NgayMuon) }}</td>
          <td>{{ formatDate(record.NgayTra) }}</td>
          <td>
            <span
              :class="{
                'status-approved': record.TrangThai === 'Đã trả',
                'status-pending': record.TrangThai === 'Đang mượn',
                'status-waiting': record.TrangThai === 'Chờ duyệt',
              }"
            >
              {{ record.TrangThai }}
            </span>
          </td>
          <td>
            <a href="#" @click.prevent="showDetail(record)" class="detail-link"
              >Chi tiết</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal chi tiết đơn mượn sách (có thể chỉnh sửa) -->
    <div v-if="isDetailModalOpen" class="edit-modal">
      <div class="modal-content">
        <h3>Chi tiết đơn mượn sách</h3>
        <form @submit.prevent="updateRequestData" class="form-container">
          <div class="form-group">
            <label> Mã Sách: </label
            ><input type="text" v-model="detailRecord.MaSach._id" />
          </div>
          <div class="form-group">
            <label> Tên Sách: </label
            ><input type="text" v-model="detailRecord.MaSach.TenSach" />
          </div>
          <div class="form-group">
            <label> Mã Độc Giả: </label
            ><input type="text" v-model="detailRecord.MaDocGia._id" />
          </div>
          <div class="form-group">
            <label> Tên Độc Giả: </label
            ><input type="text" v-model="detailRecord.MaDocGia.Ten" />
          </div>
          <div class="form-group">
            <label> SĐT Độc Giả: </label
            ><input type="text" v-model="detailRecord.MaDocGia.SoDienThoai" />
          </div>
          <div class="form-group">
            <label> Ngày Mượn: </label
            ><input
              type="date"
              :value="formatDate(detailRecord.NgayMuon)"
              required
            />
          </div>
          <div class="form-group">
            <label> Ngày Trả: </label
            ><input
              type="date"
              :value="formatDate(detailRecord.NgayTra)"
              required
            />
          </div>
          <div class="form-group">
            <label> Trạng Thái: </label
            ><input type="text" v-model="detailRecord.TrangThai" disabled />
          </div>

          <div class="form-actions">
            <button
              @click="approveRequestdata(detailRecord)"
              class="btn-primary"
            >
              Duyệt
            </button>
            <button @click="markReturneddata(detailRecord)" class="btn-primary">
              Trả
            </button>
            <button
              @click="deleteRecorddata(detailRecord._id)"
              class="btn-primary"
            >
              Xóa
            </button>
            <button @click="closeDetailModal" class="btn-secondary">
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Form thêm đơn mượn sách mới -->
    <div v-if="isAddRequestModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Thêm Đơn Mượn Sách Mới</h3>
        <form @submit.prevent="addRequestData" class="form-container">
          <div class="form-group">
            <label> Tên Sách: </label
            ><input type="text" v-model="newRequest.TenSach" />
          </div>
          <div class="form-group">
            <label> SĐT Độc Giả: </label
            ><input type="text" v-model="newRequest.SoDienThoai" />
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
            <button @click.prevent="closeAddRequestForm" class="btn-secondary">
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
  fetchRecords,
  approveRequest,
  markReturned,
  deleteRecord,
  updateRequest,
  addRequest,
} from "../stores/theodoimuonsach";

const records = ref([]);

// State cho modal chi tiết
const isDetailModalOpen = ref(false);
const detailRecord = ref({});

// Mở modal và hiển thị thông tin chi tiết
const showDetail = (record) => {
  detailRecord.value = record;
  isDetailModalOpen.value = true;
};

// Đóng modal chi tiết
const closeDetailModal = () => {
  isDetailModalOpen.value = false;
};

// Phê duyệt yêu cầu mượn sách
const approveRequestdata = async (record) => {
  await approveRequest(record._id);
  await loadRecords(); // Làm mới danh sách sau khi duyệt
  closeDetailModal();
};

// Đánh dấu sách đã trả
const markReturneddata = async (record) => {
  await markReturned(record._id);
  await loadRecords(); // Làm mới danh sách sau khi trả sách
  closeDetailModal();
};

// Xóa đơn mượn sách
const deleteRecorddata = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa bản ghi này không?")) {
    await deleteRecord(id);
    await loadRecords(); // Làm mới danh sách sau khi xóa
    closeDetailModal();
  }
};

// Modal state for adding new request
const isAddRequestModalOpen = ref(false);
const newRequest = ref({
  TenSach: "",
  SoDienThoai: "",
  NgayMuon: "",
  NgayTra: "",
});

// Mở form thêm đơn mượn
const openAddRequestForm = () => {
  isAddRequestModalOpen.value = true;
};

// Đóng form thêm đơn mượn
const closeAddRequestForm = () => {
  isAddRequestModalOpen.value = false;
  newRequest.value = {
    TenSach: "",
    SoDienThoai: "",
    NgayMuon: "",
    NgayTra: "",
  };
};

// Thêm đơn mượn sách mới
const addRequestData = async () => {
  await addRequest(newRequest.value);
  closeAddRequestForm();
  loadRecords();
};

// Lấy danh sách đơn mượn, sách, và độc giả
const loadRecords = async () => {
  records.value = await fetchRecords();
};

// Định dạng ngày
const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

// Cập nhật thông tin đơn mượn sách
const updateRequestData = async () => {
  const requestData = {
    MaSach: detailRecord.value.MaSach,
    MaDocGia: detailRecord.value.MaDocGia,
    NgayMuon: detailRecord.value.NgayMuon,
    NgayTra: detailRecord.value.NgayTra,
    TrangThai: detailRecord.value.TrangThai,
  };

  try {
    await updateRequest(detailRecord.value._id, requestData); // Giả sử updateRequest chấp nhận ID và dữ liệu mới
    await loadRecords(); // Làm mới danh sách sau khi cập nhật
    closeDetailModal();
  } catch (error) {
    console.error("Error updating request:", error);
  }
};

onMounted(() => {
  loadRecords();
});
</script>
