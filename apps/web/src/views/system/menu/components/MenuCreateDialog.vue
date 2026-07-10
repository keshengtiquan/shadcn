<script setup lang="ts">
import { watch, ref } from "vue";
import { useForm } from "@tanstack/vue-form";
import { z } from "zod";
import {
  Button,
  Input,
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui";
import { Switch } from "@workspace/ui";
import { getMenuListApi } from "@/api/menu";
import { createMenuApi } from "@/api/menu";
import type { CreateMenuParams, MenuList } from "@/api/menu/types";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  created: [];
}>();

interface FlatMenuOption {
  label: string;
  value: string;
}

const menuOptions = ref<FlatMenuOption[]>([{ label: "根菜单", value: "0" }]);

/** 将扁平数据转为树形结构，再递归展平为带缩进的选项列表 */
function flattenMenuTree(flatData: MenuList[], parentId = "0", depth = 0): FlatMenuOption[] {
  const result: FlatMenuOption[] = [];
  const prefix = depth > 0 ? "  ".repeat(depth - 1) + "├──" : "";

  const children = flatData.filter((item) => item.parentId === parentId);
  children.forEach((item) => {
    result.push({
      label: prefix + item.title,
      value: item.id,
    });
    result.push(...flattenMenuTree(flatData, item.id, depth + 1));
  });

  return result;
}

async function loadMenuOptions() {
  try {
    const { data } = await getMenuListApi();
    const flattened = flattenMenuTree(data);
    menuOptions.value = [{ label: "根菜单", value: "0" }, ...flattened];
  } catch {
    menuOptions.value = [{ label: "根菜单", value: "0" }];
  }
}

/** 对话框打开时加载菜单选项 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadMenuOptions();
    }
  },
);

const menuTypeOptions = [
  { label: "文件夹", value: "M" },
  { label: "菜单", value: "C" },
  { label: "按钮", value: "F" },
];

const formSchema = z.object({
  parentId: z.string(),
  name: z.string().min(1, "请输入菜单名称"),
  title: z.string().min(1, "请输入菜单标题"),
  icon: z.string(),
  path: z.string(),
  order: z.coerce.number().min(0, "排序必须为非负数"),
  menuType: z.string().min(1, "请选择菜单类型"),
  component: z.string(),
  hideInMenu: z.boolean(),
  badge: z.string(),
  affixTab: z.boolean(),
  keepAlive: z.boolean(),
  hideInTab: z.boolean(),
  affixTabOrder: z.coerce.number().min(0, "排序必须为非负数"),
  query: z.string(),
  iframeSrc: z.string(),
  status: z.boolean(),
});

const form = useForm({
  defaultValues: {
    parentId: "0",
    name: "",
    title: "",
    icon: "",
    path: "",
    order: 0,
    menuType: "",
    component: "",
    hideInMenu: false,
    badge: "",
    affixTab: false,
    keepAlive: false,
    hideInTab: false,
    affixTabOrder: 0,
    query: "",
    iframeSrc: "",
    status: true,
  },
  validators: {
    onSubmit: formSchema as any,
  },
  onSubmit: async ({ value }) => {
    const params: CreateMenuParams = {
      parentId: value.parentId,
      name: value.name,
      title: value.title,
      icon: value.icon,
      path: value.path,
      order: value.order,
      menuType: value.menuType,
      component: value.component,
      hideInMenu: value.hideInMenu,
      badge: value.badge,
      affixTab: value.affixTab,
      keepAlive: value.keepAlive,
      hideInTab: value.hideInTab,
      affixTabOrder: value.affixTabOrder,
      query: value.query,
      iframeSrc: value.iframeSrc,
      status: value.status,
    };
    await createMenuApi(params);
    emit("created");
    emit("update:open", false);
  },
});

function isInvalid(field: any) {
  return field.state.meta.isTouched && !field.state.meta.isValid;
}

function handleOpenChange(open: boolean) {
  emit("update:open", open);
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>创建菜单</DialogTitle>
        <DialogDescription>
          填写菜单信息以创建新的菜单项
        </DialogDescription>
      </DialogHeader>

      <form
        id="menuCreateForm"
        class="flex flex-col gap-6"
        @submit.prevent="form.handleSubmit"
      >
        <FieldGroup class="gap-4">
          <!-- 2-column grid for text/number/select fields -->
          <div class="grid grid-cols-2 gap-4">
            <!-- 上级菜单 -->
            <form.Field name="parentId">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>上级菜单</FieldLabel>
                  <Select
                    :model-value="field.state.value"
                    @update:model-value="(val: any) => field.handleChange(val ?? '0')"
                    @update:open="(open: boolean) => { if (!open) field.handleBlur(); }"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择上级菜单" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="option in menuOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 菜单名称 -->
            <form.Field name="name">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>菜单名称</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入菜单名称"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 菜单标题 -->
            <form.Field name="title">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>菜单标题</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入菜单标题"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 路由路径 -->
            <form.Field name="path">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>路由路径</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入路由路径"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 图标 -->
            <form.Field name="icon">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>图标</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入图标名称"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 组件路径 -->
            <form.Field name="component">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>组件路径</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入组件路径"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 菜单类型 -->
            <form.Field name="menuType">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>菜单类型</FieldLabel>
                  <Select
                    :model-value="field.state.value"
                    @update:model-value="(val: any) => field.handleChange(val ?? '')"
                    @update:open="(open: boolean) => { if (!open) field.handleBlur(); }"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择菜单类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="option in menuTypeOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 排序 -->
            <form.Field name="order">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>排序</FieldLabel>
                  <Input
                    :name="field.name"
                    type="number"
                    :value="field.state.value"
                    placeholder="请输入排序号"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          Number((e.target as HTMLInputElement).value),
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 徽章 -->
            <form.Field name="badge">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>徽章</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入徽章内容"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 查询参数 -->
            <form.Field name="query">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>查询参数</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入查询参数"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- iframe 地址 -->
            <form.Field name="iframeSrc">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>iframe 地址</FieldLabel>
                  <Input
                    :name="field.name"
                    :value="field.state.value"
                    placeholder="请输入 iframe 地址"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          (e.target as HTMLInputElement).value,
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 固定标签排序 -->
            <form.Field name="affixTabOrder">
              <template #default="{ field }">
                <Field>
                  <FieldLabel>固定标签排序</FieldLabel>
                  <Input
                    :name="field.name"
                    type="number"
                    :value="field.state.value"
                    placeholder="请输入固定标签排序号"
                    @input="
                      (e: Event) =>
                        field.handleChange(
                          Number((e.target as HTMLInputElement).value),
                        )
                    "
                    @blur="field.handleBlur"
                  />
                  <FieldError
                    v-if="isInvalid(field)"
                    :errors="field.state.meta.errors"
                  />
                </Field>
              </template>
            </form.Field>
          </div>

          <!-- Boolean switches row -->
          <div class="grid grid-cols-3 gap-4 pt-2 border-t">
            <!-- 状态 -->
            <form.Field name="status">
              <template #default="{ field }">
                <Field class="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FieldLabel class="cursor-pointer">状态</FieldLabel>
                  <Switch
                    :checked="field.state.value"
                    @update:checked="field.handleChange"
                    @blur="field.handleBlur"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 隐藏菜单 -->
            <form.Field name="hideInMenu">
              <template #default="{ field }">
                <Field class="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FieldLabel class="cursor-pointer">隐藏菜单</FieldLabel>
                  <Switch
                    :checked="field.state.value"
                    @update:checked="field.handleChange"
                    @blur="field.handleBlur"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 缓存页面 -->
            <form.Field name="keepAlive">
              <template #default="{ field }">
                <Field class="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FieldLabel class="cursor-pointer">缓存页面</FieldLabel>
                  <Switch
                    :checked="field.state.value"
                    @update:checked="field.handleChange"
                    @blur="field.handleBlur"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 隐藏标签页 -->
            <form.Field name="hideInTab">
              <template #default="{ field }">
                <Field class="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FieldLabel class="cursor-pointer">隐藏标签页</FieldLabel>
                  <Switch
                    :checked="field.state.value"
                    @update:checked="field.handleChange"
                    @blur="field.handleBlur"
                  />
                </Field>
              </template>
            </form.Field>

            <!-- 固定标签页 -->
            <form.Field name="affixTab">
              <template #default="{ field }">
                <Field class="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FieldLabel class="cursor-pointer">固定标签页</FieldLabel>
                  <Switch
                    :checked="field.state.value"
                    @update:checked="field.handleChange"
                    @blur="field.handleBlur"
                  />
                </Field>
              </template>
            </form.Field>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="emit('update:open', false)"
          >
            取消
          </Button>
          <Button type="submit">创建</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
