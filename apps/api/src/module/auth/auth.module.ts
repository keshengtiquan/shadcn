import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthStrategy } from "./auth.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
