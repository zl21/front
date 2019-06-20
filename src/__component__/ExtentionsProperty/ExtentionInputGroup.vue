<template>
  <div class="extentionInputGroup">
    <div class="description">{{option.description}}</div>
    <div class="content">
      <div class="input-group-item" v-for="(item, index) in option.inputLists" :key="index">
        <label :for="`${item.name}-${index}`">{{item.name}}：</label>
        <input :id="`${item.name}-${index}`" :type="item.type === 'Number' ? 'number' : 'text'" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InputGroup',
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped lang="less">
  .extentionInputGroup {
    display: flex;
    flex-direction: column;
  }
</style>
