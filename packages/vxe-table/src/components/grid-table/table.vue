<template>
  <vxe-grid  v-bind="gridOptions" v-on="gridEvents">
  </vxe-grid>
</template>

<script setup lang="ts">
import {  onMounted,  } from "vue";
import { VxeGrid } from "vxe-table";
import type { VxeGridProps, VxeGridListeners } from 'vxe-table'

const props = defineProps<{
  gridOptions: VxeGridProps
  gridEvents?: VxeGridListeners
}>()


onMounted(() => {
})
</script>

<style scoped></style>