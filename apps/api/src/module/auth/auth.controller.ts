import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Result } from "../../common/response";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/user.decorator";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return Result.ok(result);
  }

  @Get("info")
  async getCurrentUser(@CurrentUser("userId") userId: string) {
    const userInfo = await this.authService.getUserInfo(userId);
    return Result.ok(userInfo);
  }
}
