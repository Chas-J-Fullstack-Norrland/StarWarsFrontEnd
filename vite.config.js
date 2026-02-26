import { defineConfig } from "vite"
import { resolve } from "path"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  base: "/StarWarsFrontEnd/",


   build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        list: resolve(__dirname, "list.html"),
        view: resolve(__dirname, "view.html"),
        favorites: resolve(__dirname, 'favorites.html')
      }
    }
  },

  plugins:[
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectRegister: "auto",
      manifest:{
        name: 'SWAPI ChasFrontend',
        short_name: 'SWAPI-CHAS',
        description: 'group project for chas academy front end',
        start_url:"/StarWarsFrontEnd/",
        scope: "/StarWarsFrontEnd/",
        display: "standalone",
        background_color: '#FFFFFF',
        theme_color: "#000000",
        icons:[{
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'

        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable' 
        },
        {
          src: 'icons/icon.svg',
          sizes: '192x192',
          type: 'image/svg+xlm' 
        }
      ]
      }
    })

  ]
})