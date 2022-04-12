import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "static",
    lib: {
      entry: path.join("src", "index.ts"),
      formats: ["es"],
      fileName: (format) => `app.js`,
    },
  },
});
