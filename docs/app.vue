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
  <div class="container">
    <Header />

    <Content />

    <Footer />
  </div>
</template>
