import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./modules";

export const Dirzzle = "DRIZZLE_CONNECTION";
export type DirzzleDBType = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: Dirzzle,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get<string>("db.DATABASE_URL"),
        });
        return drizzle(pool, { schema: schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [Dirzzle],
})
export class DirzzleModule {}
