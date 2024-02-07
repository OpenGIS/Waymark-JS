<script setup lang="ts">
import Prism from "prismjs";

onMounted(() => {
  Prism.highlightAll();
});

const route = useRoute();
</script>

<template>
  <Header />

  <Content />

  <Footer />
</template>
