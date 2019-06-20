<template>
  <div class="extentionInput">
    <div class="description">{{option.description}}</div>
    <div class="content">
      <label for="extentionInputElement">{{option.name}}：</label>
      <input id="extentionInputElement" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Input',
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style lang="less">
  .extentionInput {
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
    }
  }
</style>
