<template>
  <SidebarMenuItem class="flex justify-center items-center">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          :tooltip="item.title"
          :is-active="checkIsActive(item.path)"
          class="cursor-pointer"
        >
          <Icon v-if="item.icon" :name="item.icon" />
          <span>{{ item.title }}</span>
          <NavBadge v-if="item.badge">{{ item.badge }}</NavBadge>
          <ChevronRight
            class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
          />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        :sideOffset="4"
        class="w-56"
      >
        <DropdownMenuLabel>
          {{ item.title }} {{ item.badge ? `(${item.badge})` : "" }}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <template
          v-for="sub in item.children"
          :key="`${sub.title}-${sub.path}`"
        >
          <!-- 有子菜单：递归渲染嵌套 Dropdown -->
          <SidebarMenuCollapsedDropdownItem
            v-if="sub.children?.length"
            :item="sub"
          />
          <!-- 无子菜单：普通链接 -->
          <DropdownMenuItem v-else asChild>
            <RouterLink
              :to="sub.path"
              :class="{ 'bg-secondary': checkIsActive(sub.path) }"
            >
              <Icon v-if="sub.icon" :name="sub.icon" />
              <span class="max-w-52 text-wrap">{{ sub.title }}</span>
              <span v-if="sub.badge" class="ms-auto text-xs">{{
                sub.badge
              }}</span>
            </RouterLink>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</template>

<script setup lang="ts">
import { SidebarMenuItem, SidebarMenuButton } from "../sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../dropdown-menu";
import { MenuItem } from "@workspace/types";
import { Icon } from "../icon";
import NavBadge from "./NavBadge.vue";
import { ChevronRight } from "lucide-vue-next";
import { RouterLink, useRoute } from "vue-router";
import SidebarMenuCollapsedDropdownItem from "./SidebarMenuCollapsedDropdownItem.vue";

interface Props {
  item: MenuItem;
}
const route = useRoute();
defineProps<Props>();

function checkIsActive(url: string): boolean {
  return route.path === url;
}
</script>

<style scoped></style>
