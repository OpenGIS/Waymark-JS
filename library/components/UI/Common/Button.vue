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
  background: linear-gradient(to bottom, #f9f9f9, #eee);
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: 5px;

  &:hover,
  &.active {
    font-weight: bold;
    border-width: 2px;
    box-shadow: inset 0 0 0 1px #666;
    background: linear-gradient(to bottom, #fff, #ddd);
    text-shadow: unset;
  }
  i {
    width: inherit;
    text-align: center;
  }
}
</style>
