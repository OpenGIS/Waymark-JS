<script setup>
import { ref } from "vue";
import Button from "@/components/UI/Common/Button.vue";
import Config from "@/components/UI/Panel/Debug/Config.vue";

const activeTab = ref("config");
</script>

<template>
  <div class="panel debug">
    <div class="panel-top">
      <h3>Debug</h3>
      <div class="tabs">
        <Button
          size="medium"
          icon="fa-cog"
          :active="activeTab === 'config'"
          @click="activeTab = 'config'"
          title="Config"
        />
      </div>
    </div>
    
    <div class="panel-content">
      <Config v-if="activeTab === 'config'" />
    </div>
  </div>
</template>

<style lang="less">
.panel.debug {
  .panel-top {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 16px;
    }
    
    .tabs {
      display: flex;
      gap: 5px;
    }
  }
  
  .panel-content {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>
