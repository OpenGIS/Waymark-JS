<script setup>
const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation(),
);

const route = useRoute();
</script>
<template>
  <!-- Navigation -->

  <!--
  [
  {
    "title": "Map",
    "_path": "/map"
  },
  {
    "title": "Viewer",
    "_path": "/viewer"
  },
  {
    "title": "Editor",
    "_path": "/editor"
  },
  {
    "title": "Customise",
    "_path": "/customise"
  },
  {
    "title": "",
    "_path": "/"
  }
]
-->

  <nav>
    <ul>
      <li v-for="item in navigation" :key="item._path">
        <NuxtLink :to="item._path">{{ item.title }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
