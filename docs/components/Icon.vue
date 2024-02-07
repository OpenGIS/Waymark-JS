<script setup>
const props = defineProps({
  name: { default: "logo", type: String },
  color: { default: "#fff", type: String },
  width: { default: "30", type: String },
  height: { default: "30", type: String },
});

const getStyle = () => {
  return `
    background-color: ${props.color};
    color: ${props.color};
    mask-image: url(/assets/icon/${props.name}.svg);
    width: ${props.width}px;
    height: ${props.height}px;
    mask-size: ${props.width}px ${props.height}px;
  `;
};
</script>

<template>
  <div class="waymark-icon-wrap">
    <div class="waymark-icon" :style="getStyle()" />

    <slot />
  </div>
</template>

<style lang="less">
.waymark-icon-wrap {
  display: inline-block;
  overflow: hidden;
  .waymark-icon {
    display: inline-block;
    mask-repeat: no-repeat;
    min-width: 32px;
    min-height: 32px;
    mask-position: center;
    overflow: hidden;
  }
}
</style>
