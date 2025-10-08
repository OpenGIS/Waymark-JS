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
  size: {
    type: String,
    default: "lg", // sm, md, lg
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

const buttonClass = computed(() => {
  let classes = ["button"];

  // Active
  if (props.active) {
    classes.push("button-active");
  }

  switch (props.size) {
    case "sm":
      classes.push("button-sm");
      break;
    case "lg":
      classes.push("button-lg");
      break;
    case "md":
    default:
      classes.push("button-md");
      break;
  }

  return classes.join(" ");
});
</script>

<template>
  <div :class="buttonClass">
    <template v-if="icon" v-for="(iconString, index) in icon.split(' ')">
      <i :class="`${iconClass(iconString)}`"></i>
    </template>
    <slot />
  </div>
</template>

<style lang="less">
// This represents the "medium" size:

// .button {
//   display: inline-block;
//   padding: 8px;
//   margin: 3px 0 3px 3px;
//   min-width: 16px;
//   font-size: 15px;
//   color: #444;
//   background: linear-gradient(to bottom, #f9f9f9, #eee);
//   box-shadow: inset 0 0 0 1px #ddd;
//   border-radius: 5px;
//   text-align: center;
//   &:hover,
//   &.button-active {
//     font-weight: bold;
//     border-width: 2px;
//     box-shadow: inset 0 0 0 1px #666;
//     background: linear-gradient(to bottom, #fff, #ddd);
//     text-shadow: unset;
//   }
//   i {
//     min-width: inherit;
//     text-align: center;
//   }
//   .count {
//     padding-left: 5px;
//     margin-left: 5px;
//     opacity: 0.8;
//     font-size: 12px;
//     border-left: 1px solid #ddd;
//   }
// }

// Re-written using LESS nested to make it easier to manage sizes

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

  &:hover,
  &.button-active {
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
    font-size: 12px;
    border-left: 1px solid #ddd;
  }

  &.button-sm {
    padding: 4px;
    font-size: 12px;
    border-radius: 3px;

    i {
      font-size: 12px;
    }
  }

  &.button-md {
    // Medium is the default size, so no changes needed
  }

  &.button-lg {
    padding: 12px;
    font-size: 18px;
    border-radius: 7px;

    i {
      font-size: 18px;
    }
  }
}
</style>
