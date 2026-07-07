<template>
  <Button
    variant="ghost"
    size="icon"
    class="w-7 h-7 cursor-pointer"
    @click="handleToggle($event)"
  >
    <Sun v-if="isDark" class="size-4" />
    <Moon v-else class="size-4" />
  </Button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Sun, Moon } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";
import { Button } from "../button";

const mode = useColorMode({
  attribute: "class",
  modes: {
    dark: "dark",
    light: "",
  },
});

const isDark = computed(() => mode.value === "dark");

const handleToggle = async (e: MouseEvent) => {
  // 检查浏览器是否支持 View Transition API
  if (!(document as any).startViewTransition) {
    mode.value = isDark.value ? "light" : "dark";
    return;
  }

  const willBeDark = !isDark.value;

  if (!willBeDark) {
    document.documentElement.classList.add("view-transition-light");
  }

  const transition = (document as any).startViewTransition(() => {
    mode.value = isDark.value ? "light" : "dark";
  });

  transition.ready.then(() => {
    const { clientX, clientY } = e;
    const radius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY),
    );

    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: willBeDark ? clipPath : clipPath.reverse(),
      },
      {
        duration: 600,
        easing: "ease-out",
        fill: "forwards",
        pseudoElement: willBeDark
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      },
    );

    if (!willBeDark) {
      setTimeout(() => {
        document.documentElement.classList.remove("view-transition-light");
      }, 600);
    }
  });
};
</script>
