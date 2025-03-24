<template>
  <div class="container">
    <!-- Navigation -->
    <NavBar />
    <main>
      <NhanVien />
    </main>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import NhanVien from "../components/NhanVien.vue";
</script>
