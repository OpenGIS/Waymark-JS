<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const demoURL = computed(() => {
  let url = config.app.baseURL;

  // Load the Waymark Map
  switch (route.path) {
    case "/":
      url += "examples/viewer-pub.html";

      break;
  }

  return url;
});
</script>

<template>
  <iframe
    :src="demoURL"
    frameborder="0"
    scrolling="no"
    width="100%"
    height="400"
  />
</template>

<style></style>
