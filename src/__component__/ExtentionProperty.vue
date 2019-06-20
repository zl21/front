<template>
  <div class="extentionProperty">
    <div class="left">
      <ul>
        <li v-for="(item, index) in options" :key="index">{{ item.name }}</li>
      </ul>
    </div>
    <div class="middle">
      <div class="item-render-area" v-for="(item, index) in options" :key="index">
        <ExtentionInput v-if="item.type === 'input'" :option="item"></ExtentionInput>
        <ExtentionRadio v-if="item.type === 'radio'" :option="item"></ExtentionRadio>
        <ExtentionInputGroup v-if="item.type === 'input-group'" :option="item"></ExtentionInputGroup>
        <ExtentionObjectGroup v-if="item.type === 'object-group'" :option="item"></ExtentionObjectGroup>
        <ExtentionObjectCombine v-if="item.type === 'object-combine'" :option="item"></ExtentionObjectCombine>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
  import ExtentionInput from './ExtentionsProperty/ExtentionInput';
  import ExtentionRadio from './ExtentionsProperty/ExtentionRadio';
  import ExtentionObjectGroup from './ExtentionsProperty/ExtentionObjectGroup';
  import ExtentionObjectCombine from './ExtentionsProperty/ExtentionObjectCombine';
  import ExtentionInputGroup from './ExtentionsProperty/ExtentionInputGroup';
  
  export default {
    name: 'ExtentionProperty',
    components: {
      ExtentionInput,
      ExtentionRadio,
      ExtentionObjectGroup,
      ExtentionObjectCombine,
      ExtentionInputGroup
    },
    props: {
      options: {
        type: Array,
        default: () => ([]),
      }
    },
    mounted() {
    }
  };
</script>

<style scoped lang="less">
  .extentionProperty {
    width: 100%;
    height: 100%;
    display: flex;
    ul li {
      list-style: none;
    }
    .left {
      flex: 2;
      border: 1px solid darkslategrey;
      display: flex;
      ul {
        flex: 1;
        display: flex;
        flex-direction: column;
        li {
          flex: 1;
          display: flex;
          align-items: center;
          padding-left: 10px;
        }
        li:hover {
          opacity: 0.8;
          cursor: pointer;
        }
      }
    }
    .middle {
      flex: 3;
      border: 1px solid red;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
      .item-render-area {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        width: 100%;
        background-color: #e1ecfc;
        border: 1px solid black
      }
    }
    .right {
      flex: 3;
      border: 1px solid blue;
    }
  }
</style>
