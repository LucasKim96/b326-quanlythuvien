// stores/sach.js
import { ref } from 'vue';
import axios from 'axios';

const books = ref([]);
const error = ref(null);

export const fetchBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/sach');
    books.value = response.data;
  } catch (err) {
    console.error('Error fetching books:', err);
    error.value = 'Failed to load books';

  }
};

export const updateBook = async (updatedBook) => {
  try {
    await axios.put(`http://localhost:5000/api/sach/edit/${updatedBook._id}`, updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    alert(error.response.data.message);

  }
};

export const addBook = async (newBook) => {
  try {
    const response = await axios.post("http://localhost:5000/api/sach/add", newBook);
    books.value.push(response.data); // Cập nhật danh sách sách với sách mới
  } catch (error) {
    console.error("Error adding book:", error);
    alert(error.response.data.message);

  }
};

export const deleteBook = async (delBook) => {
  try {
    await axios.delete(`http://localhost:5000/api/sach/delete/${delBook._id}`, delBook); // Đường dẫn API thêm nhà xuất bản
  } catch (error) {
    console.error("Lỗi khi xóa Sách:", error);
    alert(error.response.data.message);

  }
};

export const searchBooksByName = async (name) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/sach/timkiem/tensach?TenSach=${name}`);
    return response.data; // Trả về danh sách sách tìm thấy
  } catch (error) {
    console.error("Error searching books by name:", error);
    return [];
  }
};

// Tìm sách theo tác giả
export const searchBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/sach/timkiem/tacgia?TacGia=${author}`);
    return response.data; // Trả về danh sách sách tìm thấy
  } catch (error) {
    console.error("Error searching books by author:", error);
    return [];
  }
};

export { books, error };
