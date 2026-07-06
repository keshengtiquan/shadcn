<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const params = route.params;
const path = params?.path ? decodeURIComponent(params.path as string) : "";

if (path) {
  // 确保路径以 / 开头，避免相对路径问题
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  router.replace(normalizedPath);
}
else router.replace("/");
</script>

<template>
  <div>
    <h1>Redirecting...</h1>
  </div>
</template>
