<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const demoURL = computed(() => {
  let url = config.app.baseURL;

  // Load the Waymark Map
  switch (route.path) {
    // Docs Home
    case "/":
      url += "examples/viewer-pub.html";

      break;

    default:
      url = "";
  }

  return url;
});
</script>

<template>
  <iframe
    v-if="demoURL"
    :src="demoURL"
    frameborder="0"
    scrolling="no"
    width="100%"
    height="400"
  />
</template>

<style></style>
