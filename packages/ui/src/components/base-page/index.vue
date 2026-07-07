<template>
  <div :style="{padding: `${padding}px`, height: '100%'}">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  padding?: number
}>(), {
  padding: 10
})
</script>

<style scoped>

</style>