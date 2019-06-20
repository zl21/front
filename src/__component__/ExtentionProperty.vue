<template>
  <div class="extentionProperty">
    <div class="left"></div>
    <div class="middle"></div>
    <div class="right"></div>
  </div>
</template>

<script>
  export default {
    name: 'ExtentionProperty'
  }
</script>

<style scoped lang="less">
  .extentionProperty {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      flex: 1;
      border: 1px solid black;
    }
    .middle {
      flex: 2;
      border: 1px solid yellow;
    }
    .right {
      flex: 3;
      border: 1px solid blue;
    }
  }
</style>
