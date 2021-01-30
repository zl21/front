<template>
  <div class="extentionProperty">
    <div class="left">
      <ul>
        <li
          v-for="(item, index) in options"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="scrollIntoView
            (item, index)"
        >
          {{ item.name }}
          <br>
          {{ item.key === '__root__' ? '' : item.key }}
        </li>
        <li v-if="options.length === 0">
          暂无可配置项
        </li>
      </ul>
    </div>
    <div class="middle">
      <template v-for="(item, index) in options">
        <div
          v-if="index === currentIndex"
          :key="index"
          class="item-render-area"
        >
          <ExtentionInput
            v-if="item.type === 'input'"
            :id="`${item.key}-${index}-${guid}`"
            :option="item"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />
          <ExtentionRadio
            v-if="item.type === 'radio'"
            :id="`${item.key}-${index}-${guid}`"
            :option="item"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />
          <ExtentionInputGroup
            v-if="item.type === 'input-group'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))"
            :option="item"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />
          <ExtentionObjectGroup
            v-if="item.type === 'object-group'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            :option="item"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />
          <ExtentionOptions
            v-if="item.type === 'options-group'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            :option="item"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />

          <components
            :is="item.component"
            v-if="item.type === 'custom'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            :option="item"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />
        </div>
      </template>
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
  import ExtentionInput from './ExtentionInput.vue';
  import ExtentionRadio from './ExtentionRadio.vue';
  import ExtentionObjectGroup from './ExtentionObjectGroup.vue';
  import ExtentionInputGroup from './ExtentionInputGroup.vue';
  import ExtentionOptions from './ExtentionOptions.vue';
  import MultiTab from './MultiTab.vue';
  import bindKey from './bindKey.vue';

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
      ExtentionInputGroup,
      ExtentionOptions,
      MultiTab,
      bindKey
    },
    props: {
      options: {
        type: Array,
        default: () => ([]),
      },
      defaultData: {
        type: [String, Object],
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

        let fakeValue = null;
        // 针对tab配置特殊处理,显示假的配置
        if (this.rootData && 'multi_tab_conf' in this.rootData) {
          fakeValue = JSON.parse(JSON.stringify(this.rootData));
          fakeValue.multi_tab_conf = this.filterInvalidKey(fakeValue.multi_tab_conf);
        } 
        if (this.rootData && 'key_group_conf' in this.rootData) {
          fakeValue = JSON.parse(JSON.stringify(this.rootData));
          fakeValue.key_group_conf = this.filterKeyGroup(fakeValue.key_group_conf);
        } 
        if ((this.rootData && 'multi_tab_conf' in this.rootData) || (this.rootData && 'key_group_conf' in this.rootData)) {
          return JSON.stringify(fakeValue, null, 2);
        }
        return value;
      },
    },
    methods: {
      filterKeyGroup(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const group = cacheData[i];
          delete group.target.defaultselected;
          for (let j = Math.max(group.source.length - 1, 0); j >= 0; j--) {
            const row = group.source[j];
            delete row.defaultselected;
            // 删除无效来源字段
            if (!row.col_id || !row.label) {
              group.source.splice(j, 1);
            }
          }
          // 删除无效字段组配置
          if ((!group.target.col_id || !group.target.label) || group.source.length === 0) {
            cacheData.splice(i, 1);
          }
        }

        return cacheData;
      },

      // 过滤无效字段
      filterInvalidKey(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const tabIndex = i;
          const tabObj = cacheData[tabIndex];
          for (let j = Math.max(tabObj.tab_value.length - 1, 0); j >= 0; j--) {
            const keyRow = tabObj.tab_value[j];
            // 过滤不必要的字段
            delete keyRow.type;
            delete keyRow.selectOptions;
            delete keyRow.defaultSelected;
            // 删除无效字段配置
            if (!keyRow.col_name || !keyRow.operator || !keyRow.contrast_value) {
              tabObj.tab_value.splice(j, 1);
            }
          }
          // 删除无效tab配置
          if (!tabObj.tab_name || tabObj.tab_value.length === 0) {
            cacheData.splice(tabIndex, 1);
          }
        }

        return cacheData;
      },
      
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
      removeOption(keyArray) {
        const rootDataAfterRemoved = {};
        Object.keys(this.rootData).forEach((key) => {
          if (keyArray.indexOf(key) === -1) {
            rootDataAfterRemoved[key] = this.rootData[key];
          }
        });
        this.rootData = rootDataAfterRemoved;
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
      display: flex;
      border-right: 1px solid lightgrey;
      ul {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: scroll;
        li.active {
          border-left: 2px solid orangered;
        }
        li {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2px 10px;
          min-height: 35px;
        }
        li:hover {
          opacity: 0.8;
          cursor: pointer;
          color: orangered;
         // text-shadow: 1px 1px 1px #b29f1c;
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
          display: flex;
          margin: 5px;
          padding: 5px;
          background:rgba(244,246,249,1);
          .fieldName {
            color: #000;
          }
          .content {
            font-style: italic;
            padding: 5px 5px 0 15px;
          }
        }
        .content-row {
          display: flex;
          .left {
            border: none;
            label {
              padding-top: 15px;
            }
            label:first-child {
              writing-mode: vertical-lr;
            }
            label:last-child {
              writing-mode: vertical-rl;
            }
          }
          .right {
            border: none;
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
            .logInfo {
              color: orangered;
              font-style: italic;
              text-align: right;
              padding: 5px 5px 5px;
            }
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
