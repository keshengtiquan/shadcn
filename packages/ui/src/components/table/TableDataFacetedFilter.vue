<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant='outline' size='sm' class='h-8 border-dashed'>
        <CirclePlus/>
        {{ title }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class='w-50 p-0' align='start'>
      <Command>
        <CommandInput :placeholder="title"/>
        <CommandList>
          <CommandEmpty>暂无数据</CommandEmpty>
          <CommandGroup>
            <template v-for="item in options">
              <CommandItem :value="item.value">
                <div class="flex size-4 items-center justify-center rounded-sm ">
                  <Checkbox ></Checkbox>
                </div>
                <span>{{ item.label }}</span>
              </CommandItem>
            </template>
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
    Checkbox
} from "@workspace/ui";
import {CirclePlus} from 'lucide-vue-next'

const props = defineProps<{
  title?: string
  options: {
    label: string
    value: string
    icon?: string
  }[]
}>()
</script>

<style scoped>

</style>