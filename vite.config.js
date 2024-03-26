import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  server: {
    proxy: {
      "/v1/users/": "https://users.roblox.com"
    },
    cors: true,
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
  base: "/Venti-Guild-Project/",
});
