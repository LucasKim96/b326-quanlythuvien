<template>
  <div class="table-container">
    <div class="header">
      <h2 class="section-title">Đơn mượn sách</h2>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Số điện thoại độc giả</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Thông tin</th>
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
    <div v-if="isDetailModalOpen" class="add-modal">
      <div class="modal-content">
        <h3>Chi tiết đơn mượn sách</h3>
        <form class="form-container">
          <div class="form-group">
            <label>Mã Sách:</label><span>{{ detailRecord.MaSach._id }}</span>
          </div>
          <div class="form-group">
            <label>Tên Sách:</label
            ><span>{{ detailRecord.MaSach.TenSach }}</span>
          </div>
          <div class="form-group">
            <label>Mã Độc Giả:</label
            ><span>{{ detailRecord.MaDocGia._id }}</span>
          </div>
          <div class="form-group">
            <label>Tên Độc Giả:</label
            ><span>{{ detailRecord.MaDocGia.Ten }}</span>
          </div>
          <div class="form-group">
            <label>SĐT Độc Giả:</label
            ><span>{{ detailRecord.MaDocGia.SoDienThoai }}</span>
          </div>
          <div class="form-group">
            <label>Ngày Mượn:</label
            ><span>{{ formatDate(detailRecord.NgayMuon) }}</span>
          </div>
          <div class="form-group">
            <label>Ngày Trả:</label
            ><span>{{ formatDate(detailRecord.NgayTra) }}</span>
          </div>
          <div class="form-group">
            <label>Trạng Thái:</label><span>{{ detailRecord.TrangThai }}</span>
          </div>
          <div class="modal-actions">
            <button @click="closeDetailModal" class="btn-secondary">
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { records, fetchUserRecords } from "../stores/donmuonsach";

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

const loadUserRecords = async () => {
  records.value = await fetchUserRecords();
};

// Định dạng ngày
const formatDate = (date) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

onMounted(() => {
  loadUserRecords();
});
</script>
