<template>
  <div
    ref="extentionInput"
    class="extentionInput"
    @dblclick="popUp"
  >
    <Input
      ref="textarea"
      type="textarea"
      :rows="rows"
      :placeholder="placeholder"
      readonly
      :disabled="webconf.disabled"
      @on-keydown="onKeydown"
    />
    <Icon
      type="md-hammer"
      @click="popUp"
    />
    <Icon
      v-if="!webconf.disabled"
      type="iconbj_delete"
      class="R3iconbj_delete"
      @click="deleteValue"
    />

    <div v-if="showModal">
      <Modal
        ref="extentionInputModal"
        :value="showModal"
        :closable="true"
        :mask="true"
        :mask-closable="false"
        :title="'扩展属性配置'"
        :width="80"
        @on-ok="onOk"
        @on-cancel="onCancel"
      >
        <ExtensionPropertyWrap
          v-if="showModal"
          :default-data="displayData"
          :real-data="transformedData"
          :formInfo="formInfo"
          :tableName="tableName"
          :extentionConfig="extentionConfig"
          :webconf="webconf"
          @valueChange="valueChange"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import ExtensionPropertyWrap from './ExtensionPropertyWrap';
import fieldExtensionProperty from '../../constant/fieldExtensionProperty'
import tableExtensionProperty from '../../constant/tableExtensionProperty'
import { isEmptyObject } from '../../utils/object';
import deepClone from '../../utils/deepClone';
import Config from '../../../config/nameConfig';

export default {
  name: `${Config.prefixCls}ExtentionProperty`,
  components: {
    ExtensionPropertyWrap
  },
  model: {
    prop: 'value',
    event: 'valueChange'
  },
  props: {
    webconf: { // 用于控制字段表，赋值方式字段的取值，决定了扩展属性的可配置列表。
      type: Object,
      default: () => ({})
    },
    extentionConfig: {
      type: Array,
      default: () => ([])
    },
    defaultData: {
      type: [String, Object],
      default: () => ({})
    },
    ctrlOptions: {
      type: Object,
      default: () => ({
        rows: 8
      })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 表单数据,组件库测试时传
    formInfo: {
      type: Object,
      default: () => ({})
    },
    // 表名称,组件库测试时传
    table: {
      type: String,
      default: ''
    },
    network: {
      type: Object,
      default: () => ({})
    },
    value: {
      default: ''
    }
  },

  provide() {
    return {
      network: this.network,
      tableName: this.tableName
    }
  },

  data() {
    return {
      hasModified: false,
      placeholder: '',
      showModal: false,
      transformedData: {}, // 真数据
      rows: 8,
    };
  },
  computed: {
    // 展示数据
    displayData() {
      if (isEmptyObject(this.transformedData)) {
        return '';
      }

      const realData = deepClone(this.transformedData);
      const filteredData = this.filterKey(realData);
      return isEmptyObject(filteredData) ? '' : filteredData;
    }
  },
  methods: {
    // 过滤多tab配置
    filterTabData(originData) {
      const deleteDefault = true;
      const cacheData = JSON.parse(JSON.stringify(originData));
      for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
        const tabIndex = i;
        const tabObj = cacheData[tabIndex];
        for (let j = Math.max(tabObj.tab_value.length - 1, 0); j >= 0; j--) {
          const keyRow = tabObj.tab_value[j];
          if (deleteDefault) {
            // 过滤不必要的字段
            delete keyRow.type;
            delete keyRow.selectOptions;
            delete keyRow.defaultSelected;
          }
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
      const deleteDefault = true;
      const cacheData = JSON.parse(JSON.stringify(originData));
      for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
        const group = cacheData[i];
        if (deleteDefault) {
          delete group.target.defaultselected;
          delete group.target.label;
        }

        for (let j = Math.max(group.source.length - 1, 0); j >= 0; j--) {
          const row = group.source[j];
          if (deleteDefault) {
            delete row.defaultselected;
          }

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
      const deleteDefault = true;
      const cacheData = JSON.parse(JSON.stringify(originData));
      for (let i = Math.max(cacheData.length - 1, 0); i >= 0; i--) {
        const group = cacheData[i];
        if (deleteDefault) {
          delete group.defaultselected;
        }

        for (let j = Math.max(group.filter.length - 1, 0); j >= 0; j--) {
          const row = group.filter[j];

          if (deleteDefault) {
            delete row.defaultselected;
          }

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

    onKeydown(e) {
      this.$emit('keydown', e);
    },

    // 过滤空字段
    filterKey(data) {
      const fakeValue = data;
      // 针对tab配置特殊处理,显示假的配置
      if (fakeValue && 'multi_tab_conf' in fakeValue) {
        fakeValue.multi_tab_conf = this.filterTabData(fakeValue.multi_tab_conf);
        if (fakeValue.multi_tab_conf.length === 0) {
          delete fakeValue.multi_tab_conf;
        }
      }
      // 针对字段组配置特殊处理,显示假的配置
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

      return fakeValue;
    },

    // 设置输入展示内容
    setFormatedValue() {
      const dom = this.$refs.textarea.$el.querySelector('textarea')
      if (!dom) {
        return
      }
      if (this.displayData === '') {
        dom.value = '';
        return;
      }
      dom.value = JSON.stringify(this.displayData, null, 2);
    },
    valueChange(val) {
      // 先过滤undefined字段，再深拷贝
      const filteredData = JSON.parse(JSON.stringify(val))
      if(filteredData.webconf && isEmptyObject(filteredData.webconf)) {
        delete filteredData.webconf
      }
      this.transformedData = deepClone(filteredData);
    },
    popUp() {
      if (this.webconf.disabled) { return; }
      this.showModal = true;
    },
    deleteValue() {
      // 清空功能
      this.transformedData = {};
      this.placeholder = '';
      this.setFormatedValue()
      this.$emit('valueChange', '');
    },
    onOk() {
      // 手动选择配置以后，hasModified置为true
      this.hasModified = true;
      this.setFormatedValue(); // 展示假数据
      if (this.displayData === '') {
        this.$emit('valueChange', '');
      } else {
        // 因为老数据webconf会被处理一下，这里需要重新比较处理后的原始数据和扩展属性数据是否一致。一致的话需要还原webconf处理前的值
        if(JSON.stringify(this.defaultDataCache)!==JSON.stringify(this.transformedData)) {
          this.$emit('valueChange', JSON.stringify(this.transformedData));
        } else {
          this.$emit('valueChange', this.defaultData);
        }
      }
      this.showModal = false;
    },
    onCancel() {
      const dom = this.$refs.textarea.$el.querySelector('textarea')
      if (!dom) {
        return
      }

      // 恢复之前的数据
      this.transformedData = dom.value ? JSON.parse(dom.value) : {}
      this.showModal = false;
    },
    pasteListener(e) {
      e.preventDefault();
      e.stopPropagation();
      const paste = (e.clipboardData || window.clipboardData).getData('text/plain');
      if (this.$refs.textarea && this.$refs.textarea.$el.querySelector('textarea') === document.activeElement) {
        try {
          this.hasModified = true;
          const copyData = JSON.parse(paste) ? JSON.parse(paste) : '';
          let supportTypeMap = {};
          const currentTableName = this.tableName;
          if (currentTableName === 'AD_COLUMN') {
            supportTypeMap = fieldExtensionProperty.reduce((a, c) => { a[c.key] = c.supportType || 'ALL'; return a; }, {});
          } else if (currentTableName === 'AD_TABLE') {
            supportTypeMap = tableExtensionProperty.reduce((a, c) => {
              if (c.key !== '__root__') {
                a[c.key] = c.supportType || 'ALL';
              } else if (c.key === '__root__') {
                if (c.type === 'input-group') {
                  c.inputLists.forEach((d) => {
                    a[d.key] = d.supportType || 'ALL';
                  });
                }
              }
              return a;
            }, {});
          }
          const unMappedKey = [];
          if (copyData) {
            Object.keys(copyData).forEach((key) => {
              const notAllowedKey = !supportTypeMap[key];
              const notSupportedKey = supportTypeMap[key] && supportTypeMap[key] !== 'ALL' && supportTypeMap[key].indexOf(this.webconf.supportType) === -1;
              if (notAllowedKey || notSupportedKey) {
                unMappedKey.push(key);
                delete copyData[key];
              }
            });
          }
          this.placeholder = `不被支持的扩展属性：[${unMappedKey.toString()}]，请核实后再操作。`;
          if (Object.keys(copyData).length === 0) {
            this.$emit('valueChange', '');
            return;
          }
          this.transformedData = copyData || {};
          this.$emit('valueChange', JSON.stringify(copyData));
        } catch (err) {
          this.$Modal.fcWarning({
            mask: true,
            showCancel: false,
            title: '提示',
            content: '请输入json 形式的字符串',
          });
        }
      }
    },

    // 使扩展属性的webconf兼容老数据
    processWebConf(config) {
      const { webconf } = config
      if (!webconf) {
        return deepClone(config)
      }

      const newConfig = { ...deepClone(config) }
      Object.keys(webconf).forEach(key => {
        if(!newConfig[key]) {
          newConfig[key] = webconf[key]
        }
      })
      delete newConfig.webconf
      return newConfig
    }
  },
  watch: {
    defaultData: {
      handler(val) {
        this.rows = this.ctrlOptions.rows || this.rows;
        let newDefaultData = null;
        if (Object.prototype.toString.call(val) === '[object String]' && val !== '') {
          try {
            newDefaultData = JSON.parse(val);
          } catch (e) {
            throw e;
          }
        } else {
          newDefaultData = deepClone(val) || {};
        }

        this.transformedData = this.processWebConf(newDefaultData)
        this.defaultDataCache = deepClone(this.transformedData)
        this.$nextTick(() => {
          this.setFormatedValue();
        })
      },
      deep: true,
      immediate: true
    },
    'webconf.supportType': {
      handler() {
        if (this.hasModified) {
          this.placeholder = '';
          this.deleteValue();
        }
      }
    }
  },
  beforeCreate() {
    this.defaultDataCache = '' // 缓存默认值。用于比对数据是否修改过了。为了兼容老的webconf加的
  },
  mounted() {
    // 默认值是方便在组件库内容调试用
    this.tableName = this.table || this.$route.params.tableName

    this.rows = this.ctrlOptions.rows || this.rows;
    // 添加黏贴功能
    if (this.$refs.textarea && this.$refs.textarea.$el) {
      this.$refs.textarea.$el.querySelector('textarea').addEventListener('paste', this.pasteListener);
    }
  },
};
</script>

<style lang="less">
.extentionInput {
  position: relative;
  textarea {
    resize: vertical !important;
  }
  textarea::placeholder {
    font-family: Consolas, 'Hiragino Sans GB', 'Microsoft YaHei', serif;
    color: red;
    font-size: 13px;
  }
  i {
    font-size: 16px;
    position: absolute;
    right: 12px;
    bottom: 12px;
    color: #fd6442;
  }
  .R3iconbj_delete {
    right: 42px;
  }
  i:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  .popUp {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 99999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
  }
}
</style>

<style lang="less">
.ark-fktable .table {
  display: block;
}
</style>
