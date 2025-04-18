// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/content"],
  content: {
    documentDriven: true,
    highlight: {
      theme: "github-dark",
    },
    // markdown: {
    //   remarkPlugins: {
    //     "remark-gfm": true,
    //     // "remark-prism": true,
    //   },
    // },
  },

  css: [
    "~/assets/main.less",
    "github-markdown-css/github-markdown-light.css",
    // "prism-theme-github/themes/prism-theme-github-dark.css",
    "~/assets/prism.css",
  ],

  app: {
    baseURL: "/js/",
    head: {
      link: [
        { rel: "icon", type: "image/svg", href: "/js/assets/icon/waymark.svg" },
      ],
    },
  },
});
