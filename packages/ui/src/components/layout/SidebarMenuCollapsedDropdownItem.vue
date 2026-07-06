<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger class="justify-between cursor-pointer">
      <div class="flex items-center gap-2">
        <Icon v-if="item.icon" :name="item.icon" />
        <span class="max-w-52 text-wrap">{{ item.title }}</span>
      </div>
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent
      side="right"
      align="start"
      :sideOffset="4"
      class="w-56"
    >
      <DropdownMenuLabel>
        {{ item.title }} {{ item.badge ? `(${item.badge})` : "" }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <template v-for="child in item.children" :key="`${child.title}-${child.path}`">
        <!-- 有子菜单：递归渲染 -->
        <SidebarMenuCollapsedDropdownItem
          v-if="child.children?.length"
          :item="child"
        />
        <!-- 无子菜单：普通链接 -->
        <DropdownMenuItem v-else asChild>
          <RouterLink
            :to="child.path"
            :class="{ 'bg-secondary': checkIsActive(child.path) }"
          >
            <Icon v-if="child.icon" :name="child.icon" />
            <span class="max-w-52 text-wrap">{{ child.title }}</span>
            <span v-if="child.badge" class="ms-auto text-xs">{{ child.badge }}</span>
          </RouterLink>
        </DropdownMenuItem>
      </template>
    </DropdownMenuSubContent>
  </DropdownMenuSub>
</template>

<script setup lang="ts">
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../dropdown-menu";
import { MenuItem } from "@workspace/types";
import { Icon } from "../icon";
import { RouterLink, useRoute } from "vue-router";

interface Props {
  item: MenuItem;
}
const route = useRoute();
defineProps<Props>();

function checkIsActive(url: string): boolean {
  return route.path === url;
}
</script>
