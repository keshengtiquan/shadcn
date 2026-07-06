<template>
  <vxe-grid v-bind="gridOptions" v-on="gridEvents"></vxe-grid>
</template>

<script setup lang="ts">
import {VxeGrid} from "vxe-table";
import type { VxeGridProps, VxeGridListeners } from 'vxe-table'

defineProps<{
  gridOptions: VxeGridProps
  gridEvents?: VxeGridListeners
}>()
</script>

<style scoped>

</style>