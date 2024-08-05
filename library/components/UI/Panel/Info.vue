<script setup>
import { getMapAttribution } from "@/helpers/Map";
</script>

<template>
	<div v-html="getMapAttribution()" />
</template>

<style></style>
