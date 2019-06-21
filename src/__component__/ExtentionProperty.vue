<template>
  <div class="extentionProperty">
    <div class="left">
      <ul>
        <li v-for="(item, index) in options" :key="index">{{ item.name }}</li>
      </ul>
    </div>
    <div class="middle">
      <div class="item-render-area" v-for="(item, index) in options" :key="index">
        <ExtentionInput
          v-if="item.type === 'input'"
          :option="item"
          @rootDataChange="rootDataChange"></ExtentionInput>
        <ExtentionRadio
          v-if="item.type === 'radio'"
          :option="item"
          @rootDataChange="rootDataChange"></ExtentionRadio>
        <ExtentionInputGroup
          v-if="item.type === 'input-group'"
          :option="item"
          @rootDataChange="rootDataChange"></ExtentionInputGroup>
        <ExtentionObjectGroup
          v-if="item.type === 'object-group'"
          :option="item"
          @rootDataChange="rootDataChange"></ExtentionObjectGroup>
        <ExtentionObjectCombine
          v-if="item.type === 'object-combine'"
          :option="item"
          @rootDataChange="rootDataChange"></ExtentionObjectCombine>
      </div>
    </div>
    <div class="right">
      <textarea :value="formatedRootData" readonly></textarea>
    </div>
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
    data() {
      return {
        rootData: {}
      };
    },
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
    computed: {
      formatedRootData() {
        return JSON.stringify(this.rootData, null, 4);
      },
    },
    methods: {
      updateRootData(key, value) {
        this.rootData[key] = value;
      },
      rootDataChange({key, value}) {
        this.updateRootData(key, value);
      },
    },
    mounted() {
    }
  };
</script>

<style lang="less">
  .extentionProperty {
    width: 100%;
    height: 100%;
    display: flex;
    ul li {
      list-style: none;
    }
    .left {
      flex: 1.3;
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
      flex: 6.5;
      border: 1px solid red;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      .item-render-area {
        flex-direction: column;
        justify-content: center;
        width: 100%;
        background-color: #e1ecfc;
        border: 1px solid black;
        .description {
          margin: 5px;
          padding: 5px;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          .input-group-item {
            margin: 5px 7px;
            display: flex;
            flex-direction: column;
            .cell {
              text-align: right;
              line-height: 24px;
              vertical-align: middle;
              display: flex;
              flex: 1;
              .label {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;
              }
              .input, .select {
                flex: 3;
                padding: 0 5px;
              }
            }
          }
          .radioItemWrapper {
            display: flex;
            align-items: center;
            flex: 3;
            flex-wrap: wrap;
            .radioItem {
              cursor: pointer;
              padding: 5px;
              text-align: left;
              min-width: 150px;
              input[type='radio'] {
                line-height: 100%;
                vertical-align: middle;
              }
            }
            .radioItem:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .right {
      flex: 3;
      border: 1px solid blue;
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
        letter-spacing: 2px;
        padding: 5px;
      }
    }
  }
</style>
