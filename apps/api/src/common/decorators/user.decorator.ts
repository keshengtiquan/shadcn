import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (data) {
      const keys = data.split(".");
      return keys.reduce((obj, key) => obj?.[key], user);
    }
    return user;
  },
);
