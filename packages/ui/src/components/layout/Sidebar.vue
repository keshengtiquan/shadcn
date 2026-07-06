<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <GalleryVerticalEnd class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">Acme Inc</span>
              <span class="truncate text-xs">Enterprise</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent class="gap-0">
      <NavGroup
        v-for="item in menuItems"
        :key="item.path"
        :menu-item="item"
      ></NavGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import { GalleryVerticalEnd } from "lucide-vue-next";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../sidebar";
import { MenuItem } from "@workspace/types";

import NavGroup from "./NavGroup.vue";
import {onMounted} from "vue";
interface Props {
  menuItems: MenuItem[];
}
const props = defineProps<Props>();
onMounted(() => {
  console.log(props.menuItems);
})
</script>

<style scoped></style>
