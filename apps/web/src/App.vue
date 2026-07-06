<script setup lang="ts">
import { RouterView } from "vue-router";
import "vue-sonner/style.css";
import { Toaster } from "@workspace/ui";
</script>

<template>
  <RouterView />
  <Toaster position="top-center" />
</template>
