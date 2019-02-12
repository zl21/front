<template>
  <div class="navigator-primary-menu">{{ data.label }}</div>
</template>

<script>
  export default {
    name: 'NavigatorPrimaryMenu',
    props: {
      data: {
        required: true,
        default: []
      }
    }
  };
</script>

<style scoped lang="less">
  .navigator-primary-menu {
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 1 1px;
    color: #fff;
    font-size: 13px;
  }
  .navigator-primary-menu:hover {
    background-color: #2e373c;
    cursor: pointer;
  }
</style>
