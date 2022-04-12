import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "static",
    lib: {
      entry: "app.ts",
      formats: ["es"],
      fileName: (format) => `app.${format}.js`,
    },
  },
});
