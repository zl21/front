<template>
  <div class="extentionProperty">
    <div class="left">
      <ul>
        <li
          v-for="(item, index) in options"
          :key="index"
          @click="scrollIntoView(item, index)"
        >
          {{ item.name }}
          <br>
          {{ item.key }}
        </li>
      </ul>
    </div>
    <div class="middle">
      <div
        v-for="(item, index) in options"
        :key="index"
        class="item-render-area"
      >
        <ExtentionInput
          v-if="item.type === 'input'"
          :id="`${item.key}-${index}-${guid}`"
          :option="item"
          @rootDataChange="rootDataChange"
        />
        <ExtentionRadio
          v-if="item.type === 'radio'"
          :id="`${item.key}-${index}-${guid}`"
          :option="item"
          @rootDataChange="rootDataChange"
        />
        <ExtentionInputGroup
          v-if="item.type === 'input-group'"
          :id="`${item.key}-${index}-${guid}`"
          :root-data="JSON.parse(JSON.stringify(rootData))"
          :option="item"
          @rootDataChange="rootDataChange"
        />
        <ExtentionObjectGroup
          v-if="item.type === 'object-group'"
          :id="`${item.key}-${index}-${guid}`"
          :root-data="JSON.parse(JSON.stringify(rootData))"
          :option="item"
          @rootDataChange="rootDataChange"
        />
        <ExtentionObjectCombine
          v-if="item.type === 'object-combine'"
          :id="`${item.key}-${index}-${guid}`"
          :option="item"
          :root-data="JSON.parse(JSON.stringify(rootData))"
          @rootDataChange="rootDataChange"
        />
      </div>
    </div>
    <div class="right">
      <textarea
        :value="formatedRootData"
        readonly
      />
    </div>
  </div>
</template>

<script>
  import ExtentionInput from './ExtentionsProperty/ExtentionInput';
  import ExtentionRadio from './ExtentionsProperty/ExtentionRadio';
  import ExtentionObjectGroup from './ExtentionsProperty/ExtentionObjectGroup';
  import ExtentionObjectCombine from './ExtentionsProperty/ExtentionObjectCombine';
  import ExtentionInputGroup from './ExtentionsProperty/ExtentionInputGroup';

  const getGuid = () => Math.round(Math.random() * 10000000000);
  
  export default {
    name: 'ExtentionProperty',
    data() {
      return {
        guid: getGuid(),
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
        return JSON.stringify(this.rootData, null, 2);
      },
    },
    methods: {
      scrollIntoView(item, index) {
        document.querySelector(`#${item.key}-${index}-${this.guid}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      updateRootData(key, value) {
        if (value === '') {
          delete this.rootData[key];
          this.rootData = Object.assign({}, this.rootData);
        } else {
          this.rootData = Object.assign({}, this.rootData, { [key]: value });
        }
      },
      rootDataChange({ key, value }) {
        this.updateRootData(key, value);
      },
    },
    mounted() {
    }
  };
</script>

<style lang="less">
  .extentionProperty {
    border: 1px solid lightgrey;
    font-family: Consolas, "Hiragino Sans GB", "Microsoft YaHei", serif;
    width: 100%;
    height: 100%;
    display: flex;
    ul li {
      list-style: none;
    }
    .left {
      flex: 1.5;
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
      border-left: 1px solid lightgrey;
      flex: 6.5;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      .item-render-area {
        flex-direction: column;
        justify-content: center;
        width: 100%;
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
      border-left: 1px solid lightgrey;
      flex: 3;
      textarea {
        border: none;
        width: 100%;
        height: 100%;
        resize: none;
        padding: 5px;
        font-size: 12px;
        font-family: Consolas, "Microsoft YaHei", serif;
      }
    }
  }
</style>
