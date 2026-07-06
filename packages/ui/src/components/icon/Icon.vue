<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";
import { cn } from "@workspace/ui/lib/utils";

interface Props {
  name: string;
  class?: HTMLAttributes["class"];
  size?: string | number;
  color?: string;
  flip?: "horizontal" | "vertical" | "both";
  rotate?: number;
}

const props = defineProps<Props>();
</script>

<template>
  <IconifyIcon
    data-slot="icon"
    :icon="name"
    :class="cn('size-4 shrink-0', props.class)"
    v-bind="$attrs"
  />
</template>
