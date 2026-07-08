<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant='outline' size='sm' class='h-8 border-dashed'>
        <CirclePlus/>
        {{ title }}
        <template v-if="selectedValues?.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />

          <!-- 小屏数字徽章 -->
          <Badge
              variant="secondary"
              class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>

          <!-- 大屏展示区 -->
          <div class="hidden space-x-1 lg:flex">
            <template v-if="selectedValues.size > 2">
              <Badge
                  variant="secondary"
                  class="rounded-sm px-1 font-normal"
              >
                {{ selectedValues.size }} 选择
              </Badge>
            </template>
            <template v-else>
              <Badge
                  v-for="option in options.filter(item => selectedValues.has(item.value))"
                  :key="option.value"
                  variant="secondary"
                  class="rounded-sm px-1 font-normal"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class='w-50 p-0' align='start'>
      <Command>
        <CommandInput :placeholder="title"/>
        <CommandList>
          <CommandEmpty>暂无数据</CommandEmpty>
          <CommandGroup>
            <template v-for="item in options">
              <CommandItem :value="item.value" @select="() => handleSelect(item.value)">
                <div :class="cn('flex size-4 items-center justify-center rounded-sm border border-primary', isSelected(item.value)
          ? 'bg-primary text-primary-foreground'
          : 'opacity-50 [&_svg]:invisible') ">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 text-background">
                    <path
                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                        fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span>{{ item.label }}</span>
              </CommandItem>
            </template>
          </CommandGroup>
          <CommandSeparator v-if="selectedValues.size > 0"/>
          <CommandGroup v-if="selectedValues.size > 0">
            <CommandItem value="" class='justify-center text-center' @select="clearFilters">
              清除筛选
            </CommandItem>
          </CommandGroup>

        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  CommandInput,
  CommandEmpty,
  CommandList,
  Command,
  CommandGroup,
  CommandItem,
  Button,
  CommandSeparator,
  Separator,
  Badge
} from "@workspace/ui";
import {CirclePlus} from '@lucide/vue'
import {computed} from 'vue'
import {useVModel} from '@vueuse/core'
import {cn} from "@workspace/ui";

const props = defineProps<{
  title?: string
  options: {
    label: string
    value: string
    icon?: string
  }[]
  modelValue?: string[]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string[]): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: [],
})

const selectedValues = computed(() => new Set(modelValue.value))

const isSelected = (value: string) => selectedValues.value.has(value)

const handleSelect = (value: string) => {
  const next = new Set(modelValue.value)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  modelValue.value = [...next]
}

const clearFilters = () => {
  modelValue.value = []
}
</script>

<style scoped>

</style>