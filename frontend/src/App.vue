<template>
  <router-view />
</template>

<script>
import { useAuthStore } from "./stores/auth";
import { onMounted } from "vue";

export default {
  setup() {
    const authStore = useAuthStore();

    onMounted(() => {
      authStore.fetchUserIfTokenExists();
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  background-color: #c0d7ec;
}
</style>
