<script setup lang="ts">
import { onMounted, type HTMLAttributes } from "vue";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
  FieldError,
} from "@workspace/ui";
import { Input } from "@workspace/ui";
import { useForm } from "@tanstack/vue-form";
import { z } from "zod";
// import { getCaptchaApi } from "@/api/login";
import { useAuthStore } from "@/stores/auth";
import { LoginParams } from "@/api/login/types";
import { useRouter } from "vue-router";
import { DEFAULT_HOME_PATH } from "@/constants/router";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const authStore = useAuthStore();
const router = useRouter();

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});
// const captcha = ref<CaptchaData>();
const form = useForm({
  defaultValues: {
    username: "admin",
    password: "123456",
  },
  validators: {
    onSubmit: formSchema,
  },
  onSubmit: async ({ value }) => {
    const loginParams: LoginParams = {
      username: value.username,
      password: value.password,
    };
    await authStore.login(loginParams);
    await router.push(DEFAULT_HOME_PATH);
  },
});
function isInvalid(field: any) {
  return field.state.meta.isTouched && !field.state.meta.isValid;
}

// const refreshCaptcha = async () => {
//   const { data } = await getCaptchaApi();
//   captcha.value = data;
// };

onMounted(async () => {
  // await refreshCaptcha();
});
</script>

<template>
  <form
    id="loginForm"
    @submit.prevent="form.handleSubmit"
    :class="cn('flex flex-col gap-6', props.class)"
  >
    <FieldGroup class="gap-5">
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">登录您的账户</h1>
        <p class="text-muted-foreground text-sm text-balance">
          在下方输入您的用户名密码以登录您的账户
        </p>
      </div>
      <form.Field name="username">
        <template #default="{ field }">
          <Field>
            <Input
              id="username"
              :name="field.name"
              :value="field.state.value"
              @input="
                (e: Event) =>
                  field.handleChange((e.target as HTMLInputElement).value)
              "
              @blur="field.handleBlur"
              placeholder="用户名"
            />
            <FieldError
              v-if="isInvalid(field)"
              :errors="field.state.meta.errors"
            />
          </Field>
        </template>
      </form.Field>
      <form.Field name="password">
        <template #default="{ field }">
          <Field>
            <Input
              id="password"
              type="password"
              :name="field.name"
              :value="field.state.value"
              placeholder="密码"
              @input="
                (e: Event) =>
                  field.handleChange((e.target as HTMLInputElement).value)
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
      <!-- <form.Field name="captchaCode">
        <template #default="{ field }">
          <Field>
            <div class="flex gap-2">
              <Input
                id="captchaCode"
                :name="field.name"
                placeholder="验证码"
                class="flex-1"
                @input="
                  (e: Event) =>
                    field.handleChange((e.target as HTMLInputElement).value)
                "
                @blur="field.handleBlur"
              />
              <img
                :src="captcha?.captchaBase64Image"
                alt="captcha"
                class="cursor-pointer h-9 w-25 rounded-md object-cover border"
                @click="refreshCaptcha"
                title="点击刷新验证码"
              />
            </div>
            <FieldError
              v-if="isInvalid(field)"
              :errors="field.state.meta.errors"
            />
          </Field>
        </template>
      </form.Field> -->

      <Field>
        <Button type="submit"> 登录 </Button>
      </Field>
      <FieldSeparator>其他登录方式</FieldSeparator>
      <Field>
        <Button variant="outline" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button>
        <FieldDescription class="text-center">
          没有账户?
          <a href="#">注册</a>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
