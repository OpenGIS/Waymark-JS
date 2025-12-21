<script setup>
import { computed } from "vue";

// Import all SVG icons from the ui folder
const icons = import.meta.glob("@/assets/img/icons/*.svg", {
  eager: true,
  as: "url",
});

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium", // small, medium, large
  },
  rotate: {
    type: Number,
    default: 0, // degrees
  },
  mirror: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const getIconUrl = (iconString) => {
  // Remove fa- or ion- prefix if present
  const iconName = iconString.replace(/^(fa-|ion-)/, "");
  // Find the matching icon path
  const iconPath = Object.keys(icons).find((path) =>
    path.endsWith(`/${iconName}.svg`),
  );
  return iconPath ? icons[iconPath] : null;
};

const buttonClass = computed(() => {
  let classes = ["button"];

  // Active
  if (props.active) {
    classes.push("button-active");
  }

  switch (props.size) {
    case "small":
      classes.push("button-small");
      break;
    case "medium":
    default:
      classes.push("button-medium");
      break;
    case "large":
      classes.push("button-large");
      break;
  }

  if (props.disabled) {
    classes.push("button-disabled");
  }

  return classes.join(" ");
});

const iconStyle = () => {
  let style = "";

  if (props.rotate) {
    style += `transform: rotate(${props.rotate}deg);`;
  }

  if (props.mirror) {
    style += `transform: scaleX(-1);`;
  }

  return style;
};
</script>

<template>
  <div :class="buttonClass" :aria-disabled="disabled">
    <template v-if="icon" v-for="(iconString, index) in icon.split(' ')">
      <img
        v-if="getIconUrl(iconString)"
        :src="getIconUrl(iconString)"
        class="icon-svg"
        :style="iconStyle()"
      />
    </template>
    <span class="content">
      <slot />
    </span>
  </div>
</template>

<style lang="less">
.button {
  display: inline-block;
  padding: 8px;
  margin: 3px 0 3px 3px;
  min-width: 16px;
  font-size: 15px;
  color: #444;
  background: linear-gradient(to bottom, #f9f9f9, #eee);
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;

  &.button-disabled {
    color: #aaa;
    background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
    box-shadow: inset 0 0 0 1px #ccc;
    cursor: not-allowed;
    pointer-events: none;
    
    .icon-svg {
      opacity: 0.5;
    }
  }

  &:hover,
  &.button-active {
    font-weight: bold;
    border-width: 2px;
    box-shadow: inset 0 0 0 1px @waymark-primary-colour;
    background: linear-gradient(to bottom, #fff, #ddd);
    text-shadow: unset;
  }

  .icon-svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    display: inline-block;
  }

  .count {
    padding-left: 5px;
    margin-left: 5px;
    opacity: 0.8;
    font-size: 12px;
    border-left: 1px solid #ddd;
  }

  &.button-small {
    padding: 4px;
    font-size: 12px;
    border-radius: 3px;

    .icon-svg {
      width: 12px;
      height: 12px;
    }
  }

  &.button-medium {
  }

  &.button-large {
    padding: 12px;
    font-size: 18px;
    border-radius: 7px;

    .icon-svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
