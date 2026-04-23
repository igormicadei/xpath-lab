import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  server: {
    host: true,
  },
  base: "/xpath-lab/",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Carbon Web Components use the cds- prefix
          isCustomElement: (tag) => tag.startsWith("cds-"),
        },
      },
    }),
  ],
});
