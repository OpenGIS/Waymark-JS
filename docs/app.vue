<script setup lang="ts">
import Prism from "prismjs";

const route = useRoute();

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
</template>
