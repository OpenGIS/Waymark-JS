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

  <footer>
    <nav>
      <p>Your are here: {{ route.path }}</p>
    </nav>
  </footer>
</template>
