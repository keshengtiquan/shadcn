import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { Result } from "../../../common/response";
import { Public } from "../../../common/decorators/public.decorator";

@Controller("/system/menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Post("/create")
  async create(@Body() createMenuDto: CreateMenuDto) {
    const result = await this.menuService.create(createMenuDto);
    return Result.ok(result);
  }

  @Get("/list")
  async findAll() {
    const result = await this.menuService.findAll();
    return Result.ok(result);
  }

  @Get("/menuList")
  async findList() {
    const result = await this.menuService.findList();
    return Result.ok(result);
  }

  @Get("tree")
  async findTree(
    @Query("title") title?: string,
    @Query("name") name?: string,
    @Query("menuType") menuType?: string,
    @Query("status") status?: string,
  ) {
    const result = await this.menuService.findTree(
      title,
      name,
      menuType,
      status,
    );
    return Result.ok(result);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const result = await this.menuService.findOne(id);
    return Result.ok(result);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const result = await this.menuService.update(id, updateMenuDto);
    return Result.ok(result);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const result = await this.menuService.remove(id);
    return Result.ok(result);
  }
}
