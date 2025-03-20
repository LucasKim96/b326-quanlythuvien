<template>
  <div class="table-container">
    <div class="header">
      <h2 class="section-title">Quản lý mượn sách</h2>
      <button class="add-request-button" @click="openAddRequestForm">Thêm đơn mượn sách</button>
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
                'status-waiting': record.TrangThai === 'Chờ duyệt'
              }"
            >
              {{ record.TrangThai }}
            </span>
          </td>
          <td>
            <a href="#" @click.prevent="showDetail(record)" class="detail-link">Chi tiết</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal chi tiết đơn mượn sách (có thể chỉnh sửa) -->
    <div v-if="isDetailModalOpen" class="detail-modal">
      <div class="modal-content">
        <h3>Chi tiết đơn mượn sách</h3>
        <form @submit.prevent="updateRequestData">
          <label>
            Mã Sách:
              <input type="text" v-model="detailRecord.MaSach._id" />
          </label>
          <label>
            Tên Sách:
            <input type="text" v-model="detailRecord.MaSach.TenSach" />
          </label>
          <label>
            Mã Độc Giả:
            <input type="text" v-model="detailRecord.MaDocGia._id" />
          </label>
          <label>
            Tên Độc Giả:
            <input type="text" v-model="detailRecord.MaDocGia.Ten" />
          </label>
          <label>
            Số Điện Thoại Độc Giả:
            <input type="text" v-model="detailRecord.MaDocGia.SoDienThoai" />
          </label>
          <label>
            Ngày Mượn:
            <input type="date" :value="formatDate(detailRecord.NgayMuon)" required />
          </label>
          <label>
            Ngày Trả:
            <input type="date" :value="formatDate(detailRecord.NgayTra)" required />
          </label>
          <label>
            Trạng Thái:
            <input type="text" v-model="detailRecord.TrangThai" disabled/>
          </label>

          <div class="modal-actions">
            <button @click="approveRequestdata(detailRecord)">Duyệt</button>
            <button @click="markReturneddata(detailRecord)">Trả</button>
            <button @click="deleteRecorddata(detailRecord._id)">Xóa</button>
            <button @click="closeDetailModal">Đóng</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Form thêm đơn mượn sách mới -->
    <div v-if="isAddRequestModalOpen" class="add-request-modal">
      <div class="modal-content">
        <h3>Thêm đơn mượn sách mới</h3>
        <form @submit.prevent="addRequestData">
          <label>
            Tên Sách:
            <input type="text" v-model="newRequest.TenSach"/>
          </label>
          <label>
            Tên Độc Giả:
            <input type="text" v-model="newRequest.TenDocGia"/>
          </label>
          <label>
            Ngày Mượn:
            <input v-model="newRequest.NgayMuon" type="date" required />
          </label>
          <label>
            Ngày Trả:
            <input v-model="newRequest.NgayTra" type="date" required />
          </label>
          <button type="submit">Thêm đơn mượn</button>
          <button @click.prevent="closeAddRequestForm">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchRecords, approveRequest, markReturned, deleteRecord, updateRequest, addRequest } from "../stores/theodoimuonsach";

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
  TenDocGia: "",
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
    TenDocGia: "",
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
