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
    <div v-if="isDetailModalOpen" class="detail-modal">
      <div class="modal-content">
        <h3>Chi tiết đơn mượn sách</h3>
        <form>
          <label>
            Mã Sách:
            <span>{{ detailRecord.MaSach._id }}</span>
          </label>
          <label>
            Tên Sách:
            <span>{{ detailRecord.MaSach.TenSach }}</span>
          </label>
          <label>
            Mã Độc Giả:
            <span>{{ detailRecord.MaDocGia._id }}</span>
          </label>
          <label>
            Tên Độc Giả:
            <span>{{ detailRecord.MaDocGia.Ten }}</span>
          </label>
          <label>
            Số Điện Thoại Độc Giả:
            <span>{{ detailRecord.MaDocGia.SoDienThoai }}</span>
          </label>
          <label>
            Ngày Mượn:
            <span>{{ formatDate(detailRecord.NgayMuon) }}</span>
          </label>
          <label>
            Ngày Trả:
            <span>{{ formatDate(detailRecord.NgayTra) }}</span>
          </label>
          <label>
            Trạng Thái:
            <span>{{ detailRecord.TrangThai }}</span>
          </label>

          <div class="modal-actions">
            <button @click="closeDetailModal">Đóng</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { records,
  fetchUserRecords,
} from "../stores/donmuonsach";

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

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.add-request-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.add-request-button:hover {
  background-color: #3730a3;
}
.add-request-modal,
.detail-modal {
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

.modal-actions button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.status-approved {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}
.status-pending {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}
.status-waiting {
  background-color: #fef3c7;
  color: #060200;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}
</style>
