<template>
  <Button
    variant="ghost"
    size="icon"
    class="h-7 w-7 cursor-pointer"
    @click="toggleFullscreen"
  >
    <Maximize v-if="!isFullscreen" class="size-4" />
    <Minimize v-else class="size-4" />
  </Button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Maximize, Minimize } from "lucide-vue-next";
import { Button } from "../button";

const isFullscreen = ref(false);

const updateFullscreenState = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  document.addEventListener("fullscreenchange", updateFullscreenState);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", updateFullscreenState);
});

const toggleFullscreen = () => {
  const doc = document as any;
  const docEl = document.documentElement as any;

  const fullscreenElement =
    document.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement;

  if (!fullscreenElement) {
    const requestFullscreen =
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (requestFullscreen) {
      requestFullscreen.call(docEl).catch((err: Error) => {
        console.error("进入全屏失败:", err.message);
      });
    }
  } else {
    const exitFullscreen =
      document.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen;

    if (exitFullscreen) {
      exitFullscreen.call(document).catch((err: Error) => {
        console.error("退出全屏失败:", err.message);
      });
    }
  }
};
</script>
