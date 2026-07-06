<template>
  <iframe :src="frameUrl" class="w-full h-full border-0 p-[-16px]" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const frameUrl = computed(() => {
  return (route.meta as any)?.iframeSrc;
});
</script>
