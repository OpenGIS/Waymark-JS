// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/content"],
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: {
        "remark-gfm": true,
      },
    },
  },

  css: [
    "~/assets/main.less",
    "github-markdown-css/github-markdown-light.css",
    "prism-theme-github/themes/prism-theme-github-dark.css",
    "~/assets/prism.css",
  ],

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg", href: "/assets/icon/waymark.svg" },
      ],
    },
  },
});
