import { ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { type Key, pathToRegexp } from "path-to-regexp";
import { lastValueFrom, Observable } from "rxjs";
import { AuthService } from "../../module/auth/auth.service";
import { PUBLIC_KEY } from "../decorators/public.decorator";
import { AuthenticationException } from "../exceptions";
import { ResponseCode } from "../response";

type RouteWhitelistItem = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
};

export class JwtAuthGuard extends AuthGuard("jwt") {
  private globalWhiteList: RouteWhitelistItem[] = [];
  constructor(
    private readonly reflector: Reflector,
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {
    super();
    this.globalWhiteList = [].concat(
      this.config.get("perm.router.whitelist") || [],
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isInWhiteList = this.checkWhiteList(context);
    if (isInWhiteList) {
      return true;
    }

    // 委托给 Passport JWT 策略校验 token
    // 无 token / token 无效时，handleRequest 会抛出 AuthenticationException
    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return lastValueFrom(result);
    }
    return result;
  }

  checkWhiteList(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const requestPath = req.originalUrl.split("?")[0]; // 去掉查询参数（如 /user/123?name=abc → /user/123）
    const requestMethod = req.method.toUpperCase();
    // 2. 遍历白名单匹配

    return this.globalWhiteList.some((route) => {
      // 匹配请求方法：route.method 为空则不限制方法
      const methodMatch =
        !route.method || requestMethod === route.method.toUpperCase();
      if (!methodMatch) return false;

      // 匹配路径：用 pathToRegexp 的 test() 方法（更简洁，返回布尔值）
      const pathMatchResult: { regexp: RegExp; keys: Key[] } = pathToRegexp(
        route.path,
      );
      return pathMatchResult.regexp.test(requestPath);
    });
  }

  /**
   * 重写 handleRequest，抛出 AuthenticationException 而不是让 Passport 直接发送 401 响应
   * 这样可以让 GlobalExceptionFilter 统一处理
   */
  handleRequest(
    err: any,
    user: any,
    info: any,
    status: any,
    authInfo: any,
  ): any {
    if (err || !user) {
      throw new AuthenticationException(
        ResponseCode.UNAUTHORIZED,
        "请重新登录",
      );
    }
    return user;
  }
}
