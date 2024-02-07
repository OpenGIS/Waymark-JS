<template>
  <header>
    <NuxtLink to="/">
      <Icon width="60" height="60"><span>JS</span></Icon>
    </NuxtLink>

    <Nav />
  </header>
</template>

<style lang="less">
/*
  header {
    // position: fixed;
    // top: 15px;
    // right: 15px;

    img {
      width: 90px !important;
      height: 90px !important;
      border-radius: 50%;
    }
  }
*/

header {
  position: fixed;
  display: flex;
  width: 94%;
  top: 0;
  left: 0;
  z-index: 100;
  max-height: 60px;
  align-items: center;
  justify-content: space-between;
  padding: 1% 3%;
  margin-bottom: 2rem;

  a {
    position: relative;

    width: 60px;
    height: 60px;

    span {
      position: absolute;
      bottom: 5px;
      right: -13px;
      font-size: 14px;
      font-family: Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      // font-style: italic;
    }
  }
}
</style>
