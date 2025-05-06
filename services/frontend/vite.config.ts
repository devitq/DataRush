import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          code: ["monaco-editor", "@monaco-editor/react"],
          md: ["react-markdown", "rehype-katex", "remark-gfm", "remark-math"],
        },
      },
    },
  },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
  publicDir: "public",
});
