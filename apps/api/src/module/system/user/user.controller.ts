import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "../../../common/decorators/user.decorator";
import { Public } from "../../../common/decorators/public.decorator";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("info")
  getUserInfo(@CurrentUser("userId") userId: string) {
    return this.userService.getUserInfo(userId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }

  @Get(":id/roles")
  getUserRoles(@Param("id") id: string) {
    return this.userService.getUserRoles(id);
  }

  @Put(":id/roles")
  assignRoles(@Param("id") id: string, @Body() body: { roleIds: string[] }) {
    return this.userService.assignRoles(id, body.roleIds);
  }
}
