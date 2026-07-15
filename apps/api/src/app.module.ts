import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DirzzleModule } from "./db/dirzzle.module";
import { UserModule } from "./module/system/user/user.module";
import { MenuModule } from "./module/system/menu/menu.module";
import { ClsModule } from "./common/cls";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./module/auth/auth.module";
import { RoleModule } from "./module/system/role/role.module";
import { getConfig } from "./config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/auth.guard";
import { PermissionGuard } from "./common/guards/permission.guard";
import { ZodValidationPipe } from "nestjs-zod";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfig],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get("jwt.secretkey"),
        signOptions: {
          expiresIn: config.get("jwt.expiresin") || "1h",
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    // CLS 上下文模块 (Request ID)
    ClsModule,
    DirzzleModule,
    UserModule,
    MenuModule,
    RoleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
