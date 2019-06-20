<template>
  <div class="extentionInput">
    <div class="description">{{option.description}}</div>
    <div class="content">
      <div class="input-group-item">
        <label for="extentionInputElement">{{option.name}}：</label>
        <input id="extentionInputElement" :type="option.type === 'Number' ? 'number' : 'text'" />
      </div>
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
  }
</style>
