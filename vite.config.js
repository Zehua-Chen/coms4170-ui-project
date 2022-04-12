import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "static",
    manifest: true,
    rollupOptions: {
      input: path.join("src", "index.ts"),
    },
  },
});
