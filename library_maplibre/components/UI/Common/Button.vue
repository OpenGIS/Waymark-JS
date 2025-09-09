<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const iconClass = computed(() => {
  if (typeof props.icon == "string" && props.icon.indexOf("ion") === 0) {
    return `ion ${props.icon}`;
  } else {
    return `fa ${props.icon}`;
  }
});
</script>

<template>
  <div class="button" :class="active ? 'active' : ''">
    <i v-if="icon" :class="`${iconClass}`"></i>
    <slot />
  </div>
</template>

<style lang="less">
.button {
  display: flex;
  margin: 4px;
  padding: 8px 10px;
  width: 12px;
  font-size: 16px;
  color: #444;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;

  &:hover,
  &.active {
    border-width: 2px;
    border-color: #666;
    background-color: #eee;
  }

  &.active&:hover {
    color: #444;
    background: red;
  }
}
</style>
