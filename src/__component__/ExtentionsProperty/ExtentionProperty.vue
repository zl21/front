<template>
  <div class="extentionProperty">
    <div class="left">
      <ul>
        <li
          v-for="(item, index) in options"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="scrollIntoView(item, index)"
        >
          {{ item.name }}
          <br>
          {{ item.key === '__root__' ? '' : item.key }}
        </li>
      </ul>
    </div>
    <div class="middle">
      <div
        v-for="(item, index) in options"
        v-show="index === currentIndex"
        :key="index"
        class="item-render-area"
      >
        <ExtentionInput
          v-if="item.type === 'input'"
          :id="`${item.key}-${index}-${guid}`"
          :option="item"
          :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
          @rootDataChange="rootDataChange"
        />
        <ExtentionRadio
          v-if="item.type === 'radio'"
          :id="`${item.key}-${index}-${guid}`"
          :option="item"
          :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
          @rootDataChange="rootDataChange"
        />
        <ExtentionInputGroup
          v-if="item.type === 'input-group'"
          :id="`${item.key}-${index}-${guid}`"
          :default-data="JSON.parse(JSON.stringify(rootData))"
          :option="item"
          @rootDataChange="rootDataChange"
        />
        <ExtentionObjectGroup
          v-if="item.type === 'object-group'"
          :id="`${item.key}-${index}-${guid}`"
          :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
          :option="item"
          @rootDataChange="rootDataChange"
        />
        <ExtentionObjectCombine
          v-if="item.type === 'object-combine'"
          :id="`${item.key}-${index}-${guid}`"
          :option="item"
          :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
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
  import ExtentionInput from './ExtentionInput';
  import ExtentionRadio from './ExtentionRadio';
  import ExtentionObjectGroup from './ExtentionObjectGroup';
  import ExtentionObjectCombine from './ExtentionObjectCombine';
  import ExtentionInputGroup from './ExtentionInputGroup';

  const getGuid = () => Math.round(Math.random() * 10000000000);
  
  export default {
    name: 'ExtentionProperty',
    data() {
      return {
        guid: getGuid(),
        rootData: {},
        currentIndex: 0,
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
      },
      defaultData: {
        type: Object,
        default: () => ({})
      },
    },
    computed: {
      formatedRootData() {
        let value = '';
        if (Object.keys(this.rootData).length === 0) {
          value = '';
        } else {
          value = JSON.stringify(this.rootData, null, 2);
        }
        this.$emit('valueChange', value);
        return value;
      },
    },
    methods: {
      scrollIntoView(item, index) {
        this.currentIndex = index;
        // document.querySelector(`#${item.key}-${index}-${this.guid}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    created() {
      this.rootData = JSON.parse(JSON.stringify(this.defaultData));
    },
  };
</script>

<style lang="less">
  .extentionProperty {
    ul, li, div {
      box-sizing: border-box;
    }
    margin: 1px;
    background-color: #fff;
    width: 100%;
    height: 450px;
    border: 1px solid lightgrey;
    font-family: Consolas, "Hiragino Sans GB", "Microsoft YaHei", serif;
    display: flex;
    ul li {
      list-style: none;
    }
    li:not(:last-child) {
      border-bottom: 1px solid lightgrey;
    }
    .left {
      flex: 1.5;
      display: flex;
      border-right: 1px solid lightgrey;
      ul {
        flex: 1;
        display: flex;
        flex-direction: column;
        li.active {
          border-left: 2px solid orangered;
        }
        li {
          flex: 1;
          display: flex;
          align-items: center;
          padding-left: 10px;
        }
        li:hover {
          opacity: 0.8;
          cursor: pointer;
          border-left: 2px solid orangered;
        }
      }
    }
    .middle {
      flex: 6;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      .item-render-area {
        flex-direction: column;
        justify-content: center;
        width: 100%;
        padding: 7px 0 7px 7px;
        .description {
          margin: 5px;
          padding: 5px;
          background:rgba(244,246,249,1);
          .fieldName {
            color: #000;
          }
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
                flex: 1.5;
                display: flex;
                justify-content: flex-end;
                align-items: center;
              }
              .input, .select {
                flex: 3;
                padding: 0 5px;
                border: 1px solid lightgrey;
              }
              input[type="text"]::placeholder {
                color: grey;
                font-size: 12px;
                font-style: italic;
                letter-spacing: 1px;
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
        .labelWithObjectGroup {
          padding: 5px;
          margin: 5px;
          border: 1px solid lightgrey;
          .operate-button {
            background-color: transparent;
            outline: none;
            font-size: 16px;
            padding: 5px;
            border: 1px solid lightgrey;
            width: 20px;
            display: inline-block;
            height: 20px;
            line-height: 8px;
            border-radius: 13px;
            color: grey;
          }
          .operate-button:hover {
            color: #000;
            cursor: pointer;
            opacity: 0.8;
          }
        }
      }
      .item-render-area:not(:last-child) {
        border-bottom: 1px solid lightgrey;
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
