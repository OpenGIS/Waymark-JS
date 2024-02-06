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
  <div class="mini-icon-wrap">
    <div class="mini-icon" :style="getStyle()" />

    <slot />
  </div>
</template>

<style lang="less">
.mini-icon-wrap {
  display: inline-block;
  overflow: hidden;
  .mini-icon {
    display: inline-block;
    mask-repeat: no-repeat;
    min-width: 32px;
    min-height: 32px;
    mask-position: center;
    overflow: hidden;
  }
}
</style>
