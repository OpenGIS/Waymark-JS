<script setup>
import { version } from "../../package.json";
</script>

<template>
  <footer>
    <div class="left">
      <!-- WordPress -->
      <a href="https://www.waymark.dev/"
        >&laquo; <Icon width="20" height="20" color="#b42714" /> WordPress</a
      >
    </div>

    <div class="middle">
      <!-- Version -->
      v{{ version }}&nbsp;//&nbsp;<a
        href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html"
      >
        GPL v2</a
      >

      <!-- GitHub -->
      <a href="https://github.com/OpenGIS/Waymark-JS">
        <Icon name="github" color="#555" width="30" height="30" />
      </a>

      <!-- Joe -->
      <a href="https://www.morehawes.ca/">by Joe Hawes</a>
    </div>

    <div class="right">
      <Nav />
    </div>
  </footer>
</template>
