import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  base: "/StarWarsFrontEnd/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        list: resolve(__dirname, "list.html"),
        view: resolve(__dirname, "view.html")
        favorites: resolve(__dirname, 'favorites.html')
      }
    }
  }
})