<template>
  <div class='flex items-center justify-between'>
    <div class='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <Input
        :placeholder="searchPlaceholder"
        v-model="searchText"
        class='h-8 w-37.5 lg:w-62.5'
        @keyup.enter="handleSearch"
      />
      <div class='flex gap-x-2'>
        <TableDataFacetedFilter
          v-for="item in filters"
          :key="item.title"
          :title="item.title"
          :options="item.options"
          v-model="filterValues[item.fieldName ?? item.title]"
        />
      </div>
      <Button v-if="hasSearchConditions" variant="outline" class='h-8 px-2 lg:px-3' @click="handleReset">
        <RotateCcw />
        重置
      </Button>
    </div>
    <TableViewOptions :table="table"/>
  </div>
</template>

<script setup lang="ts" generic="TData">
import {ref, watch, reactive, computed} from 'vue'
import {Input} from "../input";
import {Button} from '@workspace/ui';
import TableDataFacetedFilter from "./TableDataFacetedFilter.vue";
import {RotateCcw} from '@lucide/vue';
import TableViewOptions from "@workspace/ui/components/table/TableViewOptions.vue";
import {Table} from '@tanstack/vue-table'
import {debounce} from "@workspace/utils"
const props = defineProps<{
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    title: string
    fieldName?: string
    options: {
      label: string
      value: string
      icon?: string
    }[]
  }[]
}>()

const emit = defineEmits<{
  (e: "search", payload: { searchValue: string } & Record<string, string[]>): void
  (e: "reset"): void
}>()

const searchText = ref(props.searchKey ?? "")

const isResetting = ref(false)

watch(() => props.searchKey, (val) => {
  searchText.value = val ?? ""
})

const filterValues = reactive<Record<string, string[]>>(
  (props.filters ?? []).reduce((acc, f) => {
    acc[f.fieldName ?? f.title] = []
    return acc
  }, {} as Record<string, string[]>)
)

const hasSearchConditions = computed(() => {
  if (searchText.value) return true
  return Object.values(filterValues).some(arr => arr.length > 0)
})

watch(() => props.filters, (newFilters) => {
  const keys = Object.keys(filterValues)
  keys.forEach(k => delete filterValues[k])
  ;(newFilters ?? []).forEach(f => {
    filterValues[f.fieldName ?? f.title] = []
  })
}, { deep: true })

const emitSearch = () => {
  if (isResetting.value) return
  const params: Record<string, string | string[]> = {
    searchValue: searchText.value,
  }
  Object.entries(filterValues).forEach(([key, val]) => {
    params[key] = val
  })
  emit("search", params as { searchValue: string } & Record<string, string[]>)
}

const debouncedSearch = debounce(emitSearch, 300)

// watch(searchText, () => {
//   debouncedSearch()
// })

watch(filterValues, () => {
  debouncedSearch()
}, { deep: true })

const handleSearch = () => {
  // 回车立即搜索，不防抖
  emitSearch()
}

const handleReset = () => {
  isResetting.value = true
  searchText.value = ""
  Object.keys(filterValues).forEach(key => {
    filterValues[key] = []
  })
  emit("reset")
  setTimeout(() => {
    isResetting.value = false
  }, 400)
}
</script>

<style scoped>

</style>