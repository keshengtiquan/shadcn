import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = configService.get("app.port") ?? 3000;
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(`服务地址: http://localhost:${port}`);
}
void bootstrap();
