<template>
  <div :class="classes">
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
  import ButtonFilter from './ButtonFilter.vue';
  import PassWord from './PassWord.vue';
  import { classFix } from '../../constants/global';

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
      bindKey,
      ButtonFilter,
      PassWord
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

        const fakeValue = JSON.parse(JSON.stringify(this.rootData));
        // 针对tab配置特殊处理,显示假的配置
        if (fakeValue && 'multi_tab_conf' in fakeValue) {
          fakeValue.multi_tab_conf = this.filterTabData(fakeValue.multi_tab_conf);
          if (fakeValue.multi_tab_conf.length === 0) {
            delete fakeValue.multi_tab_conf;
          }
        }

        // 针对单据标记特殊处理,显示假的配置
        if (fakeValue && 'key_group_conf' in fakeValue) {
          fakeValue.key_group_conf = this.filterKeyData(fakeValue.key_group_conf);
          if (fakeValue.key_group_conf.length === 0) {
            delete fakeValue.key_group_conf;
          }
        }

        // 针对按钮过滤特殊处理,显示假的配置
        if (fakeValue && 'listbutton_filter_conf' in fakeValue) {
          fakeValue.listbutton_filter_conf = this.filterBtnData(fakeValue.listbutton_filter_conf);
          if (fakeValue.listbutton_filter_conf.length === 0) {
            delete fakeValue.listbutton_filter_conf;
          }
        }

        if (this.showFakeValue()) {
          return JSON.stringify(fakeValue, null, 2);
        }
        return value;
      },
      classes: () => `${classFix}extentionProperty`
    },
    methods: {
      // 判断是否展示假数据
      showFakeValue() {
        if (!this.rootData) {
          return false;
        }

        const keyList = ['multi_tab_conf', 'key_group_conf', 'listbutton_filter_conf'];
        const hasKey = keyList.some(key => key in this.rootData);
        return hasKey;
      },

      // 过滤多tab配置
      filterTabData(originData) {
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

      // 过滤标记配置
      filterKeyData(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const group = cacheData[i];
          delete group.target.defaultselected;
          delete group.target.label;
          for (let j = Math.max(group.source.length - 1, 0); j >= 0; j--) {
            const row = group.source[j];
            delete row.defaultselected;
            // 删除无效来源字段
            if (!row.col_id || !row.label) {
              group.source.splice(j, 1);
            }
          }
          // 删除无效字段组配置
          if ((!group.target.col_id) || group.source.length === 0) {
            cacheData.splice(i, 1);
          }
        }

        return cacheData;
      },

      // 过滤按钮配置
      filterBtnData(originData) {
        const cacheData = JSON.parse(JSON.stringify(originData));
        for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
          const group = cacheData[i];
          delete group.defaultselected;
          for (let j = Math.max(group.filter.length - 1, 0); j >= 0; j--) {
            const row = group.filter[j];
            delete row.defaultselected;
            // 删除无效来源字段
            if (!row.col_id || !row.match_value) {
              group.filter.splice(j, 1);
            }
          }
          // 删除无效字段组配置
          if ((!group.action_id) || group.filter.length === 0) {
            cacheData.splice(i, 1);
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
