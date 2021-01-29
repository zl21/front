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
      :disabled="webConfig.disabled"
      @on-keydown="onKeydown"
    />
    <Icon
      type="md-hammer"
      @click="popUp"
    />
    <Icon
      v-if="!webConfig.disabled"
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
        <ExtentionProperty
          v-if="showModal"
          :options="options"
          :default-data="transformedData"
          @valueChange="valueChange"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
  import { extentionForColumn, extentionForTable } from '../constants/global';
  import ExtentionProperty from './ExtentionsProperty/ExtentionProperty';
  
  export default {
    name: 'ExtentionInput',
    components: {
      ExtentionProperty
    },
    props: {
      webConfig: { // 用于控制字段表，赋值方式字段的取值，决定了扩展属性的可配置列表。
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
      }
    },
    data() {
      return {
        hasModified: false,
        placeholder: '',
        currentValue: '',
        showModal: false,
        transformedData: {},
        rows: 8,
      };
    },
    computed: {
      options() {
        let configOptions = [];
        // 这里逻辑是写死的，专门针对“表”、“字段”的扩展属性
        if (this.$route.params.tableName === 'AD_COLUMN') {
          configOptions = extentionForColumn();
          if (this.webConfig.supportType && this.webConfig.supportType !== 'ALL') {
            configOptions = configOptions.filter(d => !d.supportType || (d.supportType && d.supportType.indexOf(this.webConfig.supportType) !== -1));
          }
        } else if (this.$route.params.tableName === 'AD_TABLE') {
          configOptions = extentionForTable();
        } else {
          configOptions = this.extentionConfig;
        }
        return configOptions;
      },
    },
    methods: {
      onKeydown(e) {
        this.$emit('keydown', e);
      },
      setFormatedValue() {
        if (this.$refs.extentionInput) {
          this.$refs.extentionInput.querySelector('textarea').value = this.currentValue === '""' ? '' : this.currentValue;
        }
      },
      valueChange(val) {
        this.currentValue = val;
      },
      popUp() {
        if (this.webConfig.disabled) { return; }
        this.showModal = true;
      },
      deleteValue() {
        // 清空功能
        this.transformedData = '';
        this.placeholder = '';
        this.$emit('valueChange', '');
      },
      onOk() {
        // 手动选择配置以后，hasModified置为true
        this.hasModified = true;
        this.setFormatedValue();
        if (this.currentValue === '') {
          this.$emit('valueChange', this.currentValue);
          this.transformedData = {};
        } else {
          this.$emit('valueChange', JSON.stringify(JSON.parse(this.currentValue)));
          this.transformedData = JSON.parse(this.currentValue);
        }
        this.showModal = false;
      },
      onCancel() {
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
            const currentTableName = this.$route.params.tableName;
            if (currentTableName === 'AD_COLUMN') {
              supportTypeMap = extentionForColumn().reduce((a, c) => { a[c.key] = c.supportType || 'ALL'; return a; }, {});
            } else if (currentTableName === 'AD_TABLE') {
              supportTypeMap = extentionForTable().reduce((a, c) => {
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
                const notSupportedKey = supportTypeMap[key] && supportTypeMap[key] !== 'ALL' && supportTypeMap[key].indexOf(this.webConfig.supportType) === -1;
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
            this.transformedData = copyData;
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
    },
    watch: {
      defaultData: {
        handler(val) {
          this.rows = this.ctrlOptions.rows || this.rows;
          if (Object.prototype.toString.call(val) === '[object String]' && val !== '') {
            try {
              this.transformedData = JSON.parse(val);
            } catch (e) {
              throw e;
            }
          } else {
            this.transformedData = val || {};
          }
          if (val === '') {
            this.currentValue = '';
          } else {
            this.currentValue = JSON.stringify(this.transformedData, null, 2);
          }
          setTimeout(() => {
            this.setFormatedValue();
          }, 10);
        },
        deep: true
      },
      'webConfig.supportType': {
        handler() {
          if (this.hasModified) {
            this.placeholder = '';
            this.deleteValue();
          }
        }
      }
    },
    mounted() {
      this.rows = this.ctrlOptions.rows || this.rows;
      if (Object.prototype.toString.call(this.defaultData) === '[object String]' && this.defaultData !== '') {
        try {
          this.transformedData = JSON.parse(this.defaultData);
        } catch (e) {
          throw e;
        }
      } else {
        this.transformedData = this.defaultData || {};
      }
      if (this.defaultData === '') {
        this.currentValue = '';
      } else {
        this.currentValue = JSON.stringify(this.transformedData, null, 2);
      }
      setTimeout(() => {
        this.setFormatedValue();
      }, 10);
      // 添加黏贴功能
      if (this.$refs.textarea && this.$refs.textarea.$el) {
        this.$refs.textarea.$el.querySelector('textarea').addEventListener('paste', this.pasteListener);
      }
    }
  };
</script>

<style lang="less">
  .extentionInput {
    position: relative;
    textarea {
      resize: vertical !important;
    }
    textarea::placeholder {
      font-family: Consolas, "Hiragino Sans GB", "Microsoft YaHei", serif;
      color: red;
      font-size: 13px;
    }
    i {
      font-size: 16px;
      position: absolute;
      right: 12px;
      bottom: 12px;
      color:#fd6442;
    }
    .R3iconbj_delete{
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
      background-color: rgba(0,0,0, 0.5);
      top: 0;
      left: 0;
    }
  }
</style>
