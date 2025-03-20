import { createRouter, createWebHistory } from "vue-router";
import AdminHome from "../views/AdminHome.vue";
import UserHome from "../views/UserHome.vue";
import Auth from "../views/Auth.vue";
import { useAuthStore } from "../stores/auth";
import QuanLySach from "../views/QuanLySach.vue";
import QuanLyDocGia from "../views/QuanLyDocGia.vue";
import QuanLyMuonSach from "../views/QuanLyMuonSach.vue";
import QuanLyNXB from "../views/QuanLyNXB.vue";
import InfoAdmin from "../views/InfoAdmin.vue";
import QuanLyNhanVien from "../views/QuanLyNhanVien.vue";
import DonMuonSach from "@/views/DonMuonSach.vue";
import InfoUser from "@/views/InfoUser.vue";


const routes = [
  { path: "/", name: "Auth", component: Auth },
  { path: "/admin-home", name: "AdminHome", component: AdminHome },
  { path: "/user-home", name: "UserHome", component: UserHome },
  { path: "/quan-ly-sach", name: "QuanLySach", component: QuanLySach },
  { path: "/quan-ly-doc-gia", name: "QuanLyDocGia", component: QuanLyDocGia },
  { path: "/quan-ly-muon-sach", name: "QuanLyMuonSach", component: QuanLyMuonSach },
  { path: "/quan-ly-nxb", name: "QuanLyNXB", component: QuanLyNXB },
  { path: "/quan-ly-nhan-vien", name: "QuanLyNhanVien", component: QuanLyNhanVien },
  { path: "/info-admin", name: "InfoAdmin", component: InfoAdmin },
  { path: "/info-user", name: "InfoUser", component: InfoUser },
  { path: "/don-muon-sach", name: "DonMuonSach", component: DonMuonSach },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Điều hướng sau khi đăng nhập dựa vào role
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.name === "Auth") {
    next();
  } else if (authStore.token && authStore.role) {
    if (authStore.role === "admin") {
      next();
    } else if (authStore.role === "user" && !["UserHome", "DonMuonSach", "InfoUser"].includes(to.name)) {
      next({ name: "UserHome" });
    } else {
      next();
    }
  } else {
    next({ name: "Auth" });
  }
});

export default router;
