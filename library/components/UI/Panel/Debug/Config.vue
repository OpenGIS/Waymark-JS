<script setup>
import { ref } from "vue";
import { useConfig } from "@/composables/useConfig.js";

const { config } = useConfig();
</script>

<template>
  <div class="debug-config">
    <pre>{{ JSON.stringify(config, null, 2) }}</pre>
  </div>
</template>

<style lang="less">
.debug-config {
  padding: 10px;
  overflow: auto;
  font-size: 12px;
  
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
