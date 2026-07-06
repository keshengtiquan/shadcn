<template>
  <SidebarMenu>
    <SidebarMenuLink v-if="!menuItem.children" :item="menuItem" />
    <SidebarMenuCollapsedDropdown
      v-else-if="state === 'collapsed' && !isMobile"
      :item="menuItem"
    />
    <SidebarMenuCollapsible
      class="mx-1"
      v-else="menuItem.children && menuItem.children.length > 0"
      :item="menuItem"
    />
  </SidebarMenu>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { SidebarMenu, useSidebar } from "../sidebar";
import { MenuItem } from "@workspace/types";
import SidebarMenuLink from "./SidebarMenuLink.vue";
import SidebarMenuCollapsible from "./SidebarMenuCollapsible.vue";
import SidebarMenuCollapsedDropdown from "./SidebarMenuCollapsedDropdown.vue";

interface Props {
  menuItem: MenuItem;
}

const props = defineProps<Props>();

const { state, isMobile } = useSidebar();
onMounted(() => {
  console.log(props.menuItem);
});
</script>

<style scoped></style>
