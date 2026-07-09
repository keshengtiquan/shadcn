<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger asChild>
      <Button variant='outline' size='sm' class='ms-auto hidden h-8 lg:flex'>
        <SlidersHorizontal class='size-4'/>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' class='w-37.5'>
      <DropdownMenuLabel>切换列</DropdownMenuLabel>
      <DropdownMenuSeparator/>
      <DropdownMenuCheckboxItem v-for="column in canHideColumns" :key="column.id" :model-value="column.getIsVisible()" @update:model-value="column.toggleVisibility(!!$event)">
        {{getColumnLabel(column)}}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts" generic="TData">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@workspace/ui"
import {SlidersHorizontal} from '@lucide/vue';
import {computed} from "vue";
import {Table, type Column} from '@tanstack/vue-table'

const props = defineProps<{
  table: Table<TData>
}>()

function getColumnLabel(column: Column<TData>): string {
  // 1. 用户显式指定的展示标题（最高优先级）
  const metaTitle = (column.columnDef.meta as Record<string, unknown> | undefined)?.title
  if (typeof metaTitle === 'string') return metaTitle
  // 2. header 是纯字符串时直接使用
  if (typeof column.columnDef.header === 'string') return column.columnDef.header
  // 3. 兜底：column.id
  return column.id
}

const canHideColumns = computed(() => {
  return props.table.getAllColumns()
      .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
})
</script>

<style scoped>

</style>