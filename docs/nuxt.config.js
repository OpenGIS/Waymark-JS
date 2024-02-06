// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content"],
  content: {
    markdown: {
      remarkPlugins: {
        "remark-gfm": true,
      },
    },
  },

  css: ["~/assets/main.less", "github-markdown-css/github-markdown-dark.css"],

  imports: {},
});
