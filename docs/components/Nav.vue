<script setup>
const { data: navData } = await useAsyncData("navigation", () =>
  fetchContentNavigation(),
);

const route = useRoute();

const navigation = computed(() => {
  return navData.value.filter((item) => item._path !== "/");
});

const goTo = (path) => {
  navigateTo(path);

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<template>
  <nav>
    <select @change="goTo($event.target.value)">
      <!-- Home -->
      <option value="/" :selected="route.path === '/'">Docs:</option>

      <option
        v-for="item in navigation"
        :key="item._path"
        :value="item._path"
        :selected="route.path.startsWith(item._path)"
      >
        &ndash; {{ item.title }}
      </option>
    </select>
  </nav>
</template>
