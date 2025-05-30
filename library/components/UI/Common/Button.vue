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

const iconClass = (iconString) => {
  let output = "";

  switch (true) {
    // Font Awesome icons
    case iconString.startsWith("fa-"):
      output += `fa ${iconString} `;
      break;
    // Ionic icons
    case iconString.startsWith("ion-"):
      output += `ion ${iconString} `;
      break;
  }

  return output.trim();
};
</script>

<template>
  <div class="button" :class="active ? 'active' : ''">
    <template v-if="icon" v-for="(iconString, index) in icon.split(' ')">
      <i :class="`${iconClass(iconString)}`"></i>
    </template>
    <slot />
  </div>
</template>

<style lang="less">
.button {
  display: flex;
  padding: 8px;
  min-width: 16px;
  font-size: 15px;
  color: #444;
  background: linear-gradient(to bottom, #f9f9f9, #eee);
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: 5px;
  text-align: center;
  &:hover,
  &.active {
    font-weight: bold;
    border-width: 2px;
    box-shadow: inset 0 0 0 1px #666;
    background: linear-gradient(to bottom, #fff, #ddd);
    text-shadow: unset;
  }
  i {
    min-width: inherit;
    text-align: center;
  }
  .count {
    padding-left: 5px;
    margin-left: 5px;
    opacity: 0.8;
    border-left: 1px solid #ddd;
  }
}
</style>
