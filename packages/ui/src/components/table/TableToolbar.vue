<template>
  <div class='flex items-center justify-between'>
    <div class='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <Input :placeholder="searchPlaceholder" :value="searchKey" class='h-8 w-37.5 lg:w-62.5'/>
      <div class='flex gap-x-2'>
        <TableDataFacetedFilter v-for="item in filters" :title="item.title" :options="item.options"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Input} from "../input";
import TableDataFacetedFilter from "./TableDataFacetedFilter.vue";

const props = defineProps<{
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    title: string
    options: {
      label: string
      value: string
      icon?: string
    }[]
  }[]
}>()
</script>

<style scoped>

</style>