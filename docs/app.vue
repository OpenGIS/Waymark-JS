<script setup lang="ts">
import Prism from "prismjs";

const route = useRoute();
const appConfig = useAppConfig();

const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation(),
);

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  },
);

onMounted(() => {
  Prism.highlightAll();
});
</script>

<template>
  <Header />

  <Content />

  <Footer />

  <DevOnly>
    <h2>Route</h2>

    <pre class="language-json">
      {{ JSON.stringify(route, null, 2) }}
    </pre>

    <h2>Navigation</h2>

    <pre class="language-json">
      {{ JSON.stringify(navigation, null, 2) }}
    </pre>

    <h2>App Config</h2>

    <pre class="language-json">
      {{ JSON.stringify(appConfig, null, 2) }}
    </pre>
  </DevOnly>
</template>
