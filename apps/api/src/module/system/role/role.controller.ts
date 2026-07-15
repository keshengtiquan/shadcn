import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Controller("/system/role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(200)
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roleService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(id);
  }

  @Get(":id/menuIds")
  getRoleMenuIds(@Param("id") id: string) {
    return this.roleService.getRoleMenuIds(id);
  }
}
