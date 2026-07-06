import { getUserInfoApi, loginApi } from "@/api/login";
import { LoginParams } from "@/api/login/types";
import { MenuList } from "@/api/menu/types";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref("");
    const menuList = ref<MenuList[]>([]);
    const userName = ref("");
    const nickName = ref("");
    const userId = ref();
    const email = ref("");
    const avatar = ref("");
    const hasLoadedDynamicRoutes = ref(false);

    async function login(params: LoginParams) {
      const { data } = await loginApi(params);
      token.value = data.token;
      await getUserInfo();
    }

    async function getUserInfo() {
      const { data } = await getUserInfoApi();
      console.log(data);
      userName.value = data.userName;
      nickName.value = data.nickName;
      userId.value = data.id;
      email.value = data.email;
      avatar.value = data.avatar;
    }

    function setRoutesLoaded() {
      hasLoadedDynamicRoutes.value = true;
    }

    function logout() {
      token.value = "";
      menuList.value = [];
      userName.value = "";
      nickName.value = "";
      userId.value = undefined;
      email.value = "";
      avatar.value = "";
      hasLoadedDynamicRoutes.value = false;
    }

    return {
      login,
      logout,
      token,
      menuList,
      userName,
      nickName,
      userId,
      email,
      avatar,
      hasLoadedDynamicRoutes,
      setRoutesLoaded,
    };
  },
  {
    persist: {
      pick: ["token", "menuList", "userName", "nickName", "userId", "email"],
    },
  },
);
