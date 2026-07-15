import { defineConfig } from "drizzle-kit";
import { getConfig } from "./src/config";

const config = getConfig();

export default defineConfig({
  out: "./dirzzle",
  schema: "./src/db/modules/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.db.DATABASE_URL,
  },
});
