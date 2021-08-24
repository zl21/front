<template>
  <div class="extentionProperty tw-mt-10">
    <div class="left">
      <div class="search-pannel">
        <Input
          v-model="configName"
          search
          :enter-button="$t('tips.find')"
          :placeholder="$t('extensionProperty.enterConfig')"
          @on-change="filterConfig"
        />
      </div>
      <ul class="menu-list">
        <li
          v-for="(item, index) in configList"
          :key="index"
          class="menu"
          :class="{ active: index === currentIndex }"
          @click="scrollIntoView
            (item, index)"
        >
          {{ item.name }}
          <br>
          {{ item.key === '__root__' ? '' : item.key }}
        </li>
        <li
          v-if="configList.length === 0"
          style="justify-content:center;"
        >
          {{$t('extensionProperty.noConfiguration')}}
        </li>
      </ul>
    </div>
    <div class="middle">
      <template v-for="(item, index) in configList">
        <div
          v-if="index === currentIndex"
          :key="item.name"
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
          <ExtentionSelect
            v-if="item.type === 'select'"
            :id="`${item.key}-${index}-${guid}`"
            :item="item"
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
          <!-- 值为对象，展示为多组组件的组合 -->
          <ExtensionObjectValue
            v-if="item.type === 'object-value'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            :option="item"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          ></ExtensionObjectValue>
          <ExtentionOptions
            v-if="item.type === 'options-group'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))[item.key]"
            :option="item"
            @dataChange="rootDataChange"
            @removeOption="removeOption"
          />
          <!-- 值为单一值(不为对象，数组)，适用于单个输入框，下拉框，单选框 -->
          <KeyValueItem
            v-if="item.type === 'keyValue'"
            :id="`${item.key}-${index}-${guid}`"
            :default-data="JSON.parse(JSON.stringify(rootData))"
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
            :keyForm="keyForm"
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
import i18n from '../../utils/i18n'
import ExtentionInput from './ExtentionInput.vue';
import ExtentionRadio from './ExtentionRadio.vue';
import ExtentionSelect from './LabelWithSelect.vue';
import ExtentionObjectGroup from './ExtentionObjectGroup.vue';
import ExtentionInputGroup from './ExtentionInputGroup.vue';
import ExtensionObjectValue from './ExtensionObjectValue.vue'
import ExtentionOptions from './ExtentionOptions.vue';
import KeyValueItem from './key-value-item';
import deepClone from '../../utils/deepClone';
import getFieldConfig from '../../constant/fieldExtensionProperty'
import getTableConfig from '../../constant/tableExtensionProperty'
import { isEmptyObject } from '../../utils/object';
import '../../assets/tailwindcss/index.css'

// 自动导入定制配置组件
const context = require.context('./custom', true, /\.vue$/);
const CustomComponents = {}
context.keys().forEach((key) => {
  const component = context(key).default;
  CustomComponents[component.name] = component
});

const getGuid = () => Math.round(Math.random() * 10000000000);

export default {
  name: 'ExtentionPropertyWrap',

  data() {
    return {
      guid: getGuid(),
      rootData: {},
      currentIndex: 0,
      formatedRootData: '',
      configName: '',
      configList: [],
      keyForm: {},
      supportType: '' // 控制左侧配置项是否显示用的
    };
  },
  components: {
    ExtentionInput,
    ExtentionRadio,
    ExtentionSelect,
    ExtentionObjectGroup,
    ExtensionObjectValue,
    ExtentionInputGroup,
    ExtentionOptions,
    KeyValueItem,
    ...CustomComponents
  },
  props: {
    defaultData: {
    },
    realData: {
      type: [String, Object],
      default: () => ({})
    },
    // 表单数据
    formInfo: {
      type: Object,
      default: () => ({})
    },
    tableName: {
      tableName: String
    },
    extentionConfig: {
      type: Array,
      default: () => ([])
    },
    webconf: { // 用于控制字段表，赋值方式字段的取值，决定了扩展属性的可配置列表。
      type: Object,
      default: () => ({})
    },
  },

  computed: {
    options() {
      const tableName = this.tableName;
      const keyForm = this.keyForm
      const keyConfigs = getFieldConfig();

      let configOptions = [];
      if (isEmptyObject(keyForm)) {
        return configOptions
      }
      // 这里逻辑是写死的，专门针对“表”、“字段”的扩展属性
      if (tableName === 'AD_COLUMN') {
        configOptions = keyConfigs;
        if (this.supportType && this.supportType !== 'ALL') {
          configOptions = configOptions.filter(d => !d.supportType || (d.supportType && d.supportType.indexOf(this.supportType) !== -1));
        }

        // 过滤受【显示控件】字段影响的配置，例如图片和文档的情况
        if (this.supportType === 'byPage' && keyForm.DISPLAYTYPE !== 'image') {
          configOptions = configOptions.filter(d => d.key !== 'ImageSize')
        }
        if (this.supportType === 'byPage' && keyForm.DISPLAYTYPE !== 'doc') {
          configOptions = configOptions.filter(d => {
            const fields = ['filesLength', 'filesize', 'UploadAccept']
            return !fields.includes(d.key)
          })
        }
        // 特殊处理针对指定字段的配置
        // 这些配置只有指定条件下才显示
        const blackList = ['display', 'targetField'];
        configOptions = configOptions.filter(d => !blackList.includes(d.key));
        if (keyForm.DESCRIPTION === '扩展属性') {
          const option = keyConfigs.find(d => d.name === this.$t('extensionProperty.displayControl')); // 因为key有相同的，所以用name进行查找
          configOptions.push(option);
        }
        if (keyForm.DESCRIPTION === '扩展属性' && keyForm.AD_TABLE_ID_LABEL === 'AD_COLUMN') {
          const option = keyConfigs.find(d => d.key === 'targetField');
          configOptions.push(option);
        }
        if (keyForm.DESCRIPTION === '读写规则' || keyForm.DESCRIPTION === '读写打印规则') {
          const option = keyConfigs.find(d => d.name === this.$t('extensionProperty.readWriteDisplay'));
          configOptions.push(option);
        }
        
        const option = deepClone(keyConfigs.find(d => d.name === this.$t('extensionProperty.expansionComponent')));
        if (this.supportType === 'byPage' && keyForm.DISPLAYTYPE && (keyForm.DISPLAYTYPE.startsWith('textarea') || keyForm.DISPLAYTYPE.startsWith('text')) && keyForm.DESCRIPTION !== '扩展属性' && keyForm.DESCRIPTION !== '读写规则') {
          option.components[0].selectOptions.push({ label: 'YearMonth', value: 'YearMonth' })
        }
        configOptions.push(option);

      } else if (tableName === 'AD_TABLE') {
        const blackList = ['hiddenSubtable'];
        const tableConfigs = getTableConfig().filter(d => !blackList.includes(d.key));

        // 特殊处理针对指定字段的配置
        // 这些配置只有指定条件下才显示
        if(this.$route.params.itemId !== 'New') {
          const option = getTableConfig().find(d => d.key === 'hiddenSubtable');
          tableConfigs.push(option);
        }

        configOptions = tableConfigs;
      } else {
        configOptions = this.extentionConfig;
      }

      return configOptions;
    },
  },

  provide() {
    return {
      keyForm: this.keyForm,
    }
  },

  watch: {
    // 展示用的假数据，统一从父组件拿
    defaultData: {
      handler(val) {
        this.formatedRootData = this.setDisplayValue(val);
      },
      immediate: true
    },
    // 给接口用的真实数据
    realData: {
      handler(val) {
        if (!val) {
          this.rootData = {};
          return;
        }
        this.rootData = deepClone(val);
      },
      immediate: true
    },

    options: {
      handler(newVal) {
        this.configList = deepClone(newVal);
      }
    }
  },

  methods: {
    // 筛选配置项
    filterConfig(e) {
      const value = e.target.value;
      if (value === '') {
        this.configList = deepClone(this.options);
        return;
      }
      this.configList = this.options.filter(item => item.name.includes(value));
      // 查询后默认展示第一个
      if(this.configList.length > 0) {
        this.currentIndex = 0
      }
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
      this.$emit('valueChange', this.rootData);
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
      this.$emit('valueChange', this.rootData);
    },

    setDisplayValue(data) {
      let value = '';
      if (Object.keys(data).length === 0) {
        value = '';
      } else {
        value = JSON.stringify(data, null, 2);
      }

      return value;
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  created() {
    if (Object.keys(this.formInfo).length === 0) {
      this.$nextTick(async () => {
        const ModuleComponent = window.vm.$_live_getChildComponent(window.vm, this.webconf.moduleName)
        const panelComponent = window.vm.$_live_getChildComponent(ModuleComponent, 'panelForm')
        const data = await panelComponent.getFormData()
        const dataLabel = await panelComponent.getFormDataLabel()

        this.keyForm = {
          DESCRIPTION: data.DESCRIPTION,
          DISPLAYTYPE: data.DISPLAYTYPE,
          OBTAINMANNER: data.OBTAINMANNER,
          AD_TABLE_ID: data.AD_TABLE_ID,
          AD_TABLE_ID_LABEL: dataLabel.AD_TABLE_ID && dataLabel.AD_TABLE_ID[0].Label,
          COLTYPE: data.COLTYPE,
          NAME: data.NAME
        }
        if (this.webconf.webconf && this.webconf.webconf.targetField) {
          const targetField = this.webconf.webconf.targetField.split(',')
          const supportType = []
          targetField.forEach(field => {
            supportType.push(data[field])
          })
          this.supportType = supportType.join(',') // 为了兼容以后多字段控制
        }
      })
    } else {
      this.keyForm = this.formInfo
    }
  }
};
</script>

<style lang="less">
.extentionProperty {
  .search-pannel {
    position: absolute;
    left: -1px;
    top: -2px;
    right: -1px;
  }
  .menu-list {
    margin-top: 26px;
  }
  .menu-list,
  .menu,
  div {
    box-sizing: border-box;
  }
  margin: 1px;
  background-color: #fff;
  width: 100%;
  height: 450px;
  border: 1px solid lightgrey;
  font-family: Consolas, 'Hiragino Sans GB', 'Microsoft YaHei', serif;
  display: flex;
  ul .menu {
    list-style: none;
  }
  .menu:not(:last-child) {
    border-bottom: 1px solid lightgrey;
  }
  .left {
    position: relative;
    display: flex;
    border-right: 1px solid lightgrey;
    min-width: 160px;
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
        padding: 4px 10px;
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
        background: rgba(244, 246, 249, 1);
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
            .input,
            .select {
              flex: 3;
              padding: 0 5px;
              border: 1px solid lightgrey;
            }
            input[type='text']::placeholder {
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
      font-family: Consolas, 'Microsoft YaHei', serif;
    }
  }
}
</style>
