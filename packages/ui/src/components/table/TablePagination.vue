<template>
  <div
      :class="cn('flex items-center justify-between overflow-clip','@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4')">
    <div class="flex w-full items-center justify-between">
      <div class='flex w-35 items-center justify-center text-sm font-medium @2xl/content:hidden'>
        第{{ currentPage }} 页/共 {{ totalPages }}页
      </div>
      <div class='flex items-center gap-2 @max-2xl/content:flex-row-reverse'>
        <Select :model-value="table.getState().pagination.pageSize" @update:model-value="(v) => table.setPageSize(Number(v))">
          <SelectTrigger class='h-8 w-17.5'>
            <SelectValue placeholder="10"/>
          </SelectTrigger>
          <SelectContent side='top'>
            <SelectItem v-for="pageSize in pagesList" :key="pageSize" :value="pageSize">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p class='hidden text-sm font-medium sm:block'>{{}}</p>
      </div>
    </div>

    <div class='flex items-center sm:space-x-6 lg:space-x-8'>
      <div class='flex w-35 items-center justify-center text-sm font-medium @max-3xl/content:hidden'>
        第{{ currentPage }} 页/共 {{ totalPages }}页
      </div>
      <div class='flex items-center space-x-2'>
        <Button variant='outline' class='size-8 p-0 @max-md/content:hidden' @click="() => table.setPageIndex(0)" :disabled="!table.getCanPreviousPage()">
          <span class='sr-only'>跳至第一页</span>
          <ChevronsLeft class="h-4 w-4"/>
        </Button>
        <Button variant='outline' class='size-8 p-0' @click="() => table.previousPage()" :disabled="!table.getCanPreviousPage()">
          <span class='sr-only'>上一页</span>
          <ChevronLeft className='h-4 w-4'/>
        </Button>
        <div v-for="(pageNumber,index) in pageNumbers" :key="`${pageNumber}-${index}`" class='flex items-center'>
          <span v-if="pageNumber === '...'" class='px-1 text-sm text-muted-foreground'>...</span>
          <Button v-else :variant="currentPage === pageNumber ? 'default' : 'outline'" class='h-8 min-w-8 px-2' @click="() => table.setPageIndex((pageNumber as number) - 1)">
            <span class='sr-only'>跳至{{ pageNumber }}页</span>
            {{ pageNumber }}
          </Button>
        </div>
        <Button variant='outline' class='size-8 p-0' @click="() => table.nextPage()"  :disabled="!table.getCanNextPage()">
          <span class='sr-only'>下一页</span>
          <ChevronRight className='h-4 w-4'/>
        </Button>
        <Button variant='outline' class='size-8 p-0 @max-md/content:hidden' @click="() => table.setPageIndex(table.getPageCount() - 1)" :disabled="!table.getCanNextPage()">
          <span class='sr-only'>跳至最后一页</span>
          <ChevronsRight class="h-4 w-4"/>
        </Button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import {Table} from "@tanstack/vue-table";
import {cn} from "@workspace/ui";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button} from "@workspace/ui";
import {computed, } from "vue";
import {ChevronsLeft,ChevronLeft, ChevronRight,ChevronsRight   } from '@lucide/vue';
import {getPageNumbers} from "./utils";

const {table} = defineProps<{
  table: Table<TData>
  class?: string
}>()
const pagesList = [10, 20, 30, 40, 50];
const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const totalPages = computed(() => table.getPageCount())
const pageNumbers = computed(() => getPageNumbers(currentPage.value, totalPages.value))

</script>

<style scoped>

</style>