import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm"],
  outDir: "build",
  clean: true,
  sourcemap: true,
  dts: true,
  splitting: false,
  treeshake: true,
});
