// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: false,

  css: [
    // "~/assets/main.less",
    // "maplibre-gl/dist/maplibre-gl.css",
  ],

  modules: ["@pinia/nuxt"],
});