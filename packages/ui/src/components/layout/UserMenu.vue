<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="gap-2 px-2">
        <Avatar>
          <AvatarImage :src="avatar" :alt="userName" />
          <AvatarFallback>{{
            userName.charAt(0).toUpperCase()
          }}</AvatarFallback>
        </Avatar>
        <span class="text-sm font-medium">{{ userName }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex items-center gap-2">
          <Avatar class="size-8">
            <AvatarImage :src="avatar" :alt="userName" />
            <AvatarFallback>{{
              userName.charAt(0).toUpperCase()
            }}</AvatarFallback>
          </Avatar>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{{ userName }}</span>
              <Badge variant="secondary" class="text-xs">{{ badge }}</Badge>
            </div>
            <span class="text-xs text-muted-foreground">{{ email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="$emit('profile')">
        <User class="mr-2 size-4" />
        <span>个人中心</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('logout')">
        <LogOut class="mr-2 size-4" />
        <span>退出登录</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Badge } from "../badge";
import { Button } from "../button";
import { User, LogOut } from "@lucide/vue";

interface Props {
  userName?: string;
  email?: string;
  avatar?: string;
  badge?: string;
}

withDefaults(defineProps<Props>(), {
  userName: "shadcn",
  email: "shadcn@example.com",
  avatar: "https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp",
  badge: "Pro",
});

defineEmits<{
  profile: [];
  logout: [];
}>();
</script>
