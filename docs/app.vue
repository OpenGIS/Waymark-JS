<script setup lang="ts">
import Prism from "prismjs";

const route = useRoute();

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 200);
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
