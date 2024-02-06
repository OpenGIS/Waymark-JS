<script setup lang="ts">
import Prism from "prismjs";

onMounted(() => {
  Prism.highlightAll();
});

const route = useRoute();
</script>

<template>
  <header><Icon /></header>

  <main>
    <ContentDoc class="markdown-body">
      <template #not-found>
        <h1>Not Found</h1>

        <p>The content you are looking for can not be found.</p>
      </template>
    </ContentDoc>
  </main>

  <footer>
    <nav>
      <p>Your are here: {{ route.path }}</p>
    </nav>
  </footer>
</template>
