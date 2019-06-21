<template>
  <div class="extentionRadio">
    <Description :option="option"></Description>
    <div class="content">
      <EnumerateRadioItem :option="option"></EnumerateRadioItem>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import EnumerateRadioItem from './EnumerateRadioItem';
  
  export default {
    name: 'ExtentionRadio',
    components: {
      Description,
      EnumerateRadioItem
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style lang="less">
  .extentionRadio {
    display: flex;
    flex-direction: column;
  }
</style>
