// 验证码数据
export type CaptchaData = {
  captchaUuid: string;
  captchaText: string;
  captchaBase64Image: string;
  expireSeconds: number;
};

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface UserInfo {
  id: string;
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  avatar: string;
  status: string;
  deptId: number;
}
