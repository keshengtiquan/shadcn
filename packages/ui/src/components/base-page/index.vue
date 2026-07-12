<script setup lang="ts">
defineProps<{
  title?: string;
  subTitle?: string;
}>()
</script>
<template>
  <div class="py-6 px-4  @7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl flex flex-col gap-3">
      <div class='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 class='text-2xl font-bold tracking-tight'>{{title}}</h2>
          <p class='text-muted-foreground'>
            {{subTitle}}
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <slot name="extra"></slot>
        </div>
      </div>
    <slot />
  </div>
</template>