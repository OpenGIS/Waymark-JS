<script setup>
import { computed } from "vue";

// Import all SVG icons as raw strings
const icons = import.meta.glob("@/assets/img/icons/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
  rotate: {
    type: Number,
    default: 0,
  },
  mirror: {
    type: Boolean,
    default: false,
  },
});

const iconContent = computed(() => {
  if (!props.icon) return null;
  const iconName = props.icon.replace(/^(fa-|ion-)/, "");
  const iconPath = Object.keys(icons).find((path) =>
    path.endsWith(`/${iconName}.svg`),
  );
  return iconPath ? icons[iconPath] : null;
});

const style = computed(() => {
  const transforms = [];
  if (props.rotate) {
    transforms.push(`rotate(${props.rotate}deg)`);
  }
  if (props.mirror) {
    transforms.push(`scaleX(-1)`);
  }

  const s = {};
  if (transforms.length) {
    s.transform = transforms.join(" ");
  }
  if (props.color) {
    s.color = props.color;
  }
  return s;
});
</script>

<template>
  <span
    v-if="iconContent"
    class="waymark-icon"
    v-html="iconContent"
    :style="style"
  ></span>
</template>

<style>
.waymark-icon {
  display: inline-block;
  vertical-align: middle;
}

.waymark-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
  display: block;
}
</style>
