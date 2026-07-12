import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: false,
  outDir: "dist",
  external: [
    "lodash-es",
    "nprogress",
    "nprogress/nprogress.css",
  ],
});
