<script setup>
const { data: navData } = await useAsyncData("navigation", () =>
  fetchContentNavigation(),
);

const route = useRoute();

const navigation = computed(() => {
  return navData.value.filter((item) => item._path !== "/");
});
</script>

<template>
  <nav>
    <select>
      <!-- Home -->
      <option value="/" :selected="route.path === '/'" @click="navigateTo('/')">
        Docs:
      </option>

      <option
        v-for="item in navigation"
        :key="item._path"
        :value="item._path"
        :selected="route.path.startsWith(item._path)"
        @click="navigateTo(item._path)"
      >
        &ndash; {{ item.title }}
      </option>
    </select>
  </nav>
</template>
