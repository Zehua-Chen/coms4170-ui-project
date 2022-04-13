import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/static/",
  build: {
    outDir: "static",
    manifest: true,
    rollupOptions: {
      input: path.join("src", "index.ts"),
    },
  },
});
