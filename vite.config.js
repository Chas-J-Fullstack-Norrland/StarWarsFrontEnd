import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  base: "/StarWarsFrontEnd/",
  server: {
    hmr: {
      path: 'StarWarsFrontEnd/'
    }
  },

  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      },
      input: {
        main: resolve(__dirname, "index.html"),
        list: resolve(__dirname, "list.html"),
        view: resolve(__dirname, "view.html"),
        favorites: resolve(__dirname, 'favorites.html')
      }
    }
  }
})