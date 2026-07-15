import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { userTable } from "../../db/modules";
import { eq } from "drizzle-orm";
import { Dirzzle, type DirzzleDBType } from "../../db/dirzzle.module";
import { BusinessException } from "../../common/exceptions";
import { ResponseCode } from "../../common/response";
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(Dirzzle) private db: DirzzleDBType,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt.secretkey"),
    });
  }

  async validate(payload: any) {
    // 从数据库查询用户，确保用户仍然存在且未被禁用
    const users = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, payload.sub))
      .limit(1);

    const user = users[0];

    if (!user) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    if (user.status === "1") {
      throw new BusinessException(
        ResponseCode.ACCOUNT_DISABLED,
        "用户已被禁用",
      );
    }

    return {
      userId: payload.sub,
      username: payload.username,
      permissions: payload.permissions ?? [],
    };
  }
}
