<script setup>
const { prev, next } = useContent();

const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
};
</script>
<template>
  <!-- Smooth scroll to top of body -->
  <div class="pagination">
    <NuxtLink v-if="prev" :to="prev._path" class="prev" @click="scrollToTop">{{
      prev.title
    }}</NuxtLink>

    <NuxtLink v-if="next" :to="next._path" class="next" @click="scrollToTop">{{
      next.title
    }}</NuxtLink>
  </div>
</template>

<style lang="less">
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 2rem;

  a {
    display: inline-block;
    padding: 1rem;
    border: none;
    text-decoration: none;

    &.prev {
      margin-right: auto;

      &:before {
        content: "←";
        margin-right: 0.5rem;
      }
    }

    &.next {
      margin-left: auto;

      &:after {
        content: "→";
        margin-left: 0.5rem;
      }
    }
  }
}
</style>
