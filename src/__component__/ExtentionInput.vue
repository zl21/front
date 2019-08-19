<template>
  <div
    ref="extentionInput"
    class="extentionInput"
    @dblclick="popUp"
  >
    <Input
      type="textarea"
      :rows="rows"
      :placeholder="''"
      readonly
      @on-keydown="onKeydown"
    />
    <Icon
      type="md-hammer"
      @click="popUp"
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
      }
    },
    data() {
      return {
        currentValue: '',
        showModal: false,
        transformedData: {},
        rows: 8,
        options: {}
      };
    },
    methods: {
      onKeydown(e) {
        this.$emit('keydown', e);
      },
      setFormatedValue() {
        this.$refs.extentionInput.querySelector('textarea').value = this.currentValue === '""' ? '' : this.currentValue;
      },
      valueChange(val) {
        this.currentValue = val;
      },
      popUp() {
        this.showModal = true;
      },
      onOk() {
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
    },
    created() {
      // 这里逻辑是写死的，专门针对“表”、“字段”的扩展属性
      if (this.$route.params.tableName === 'AD_COLUMN') {
        this.options = extentionForColumn();
      } else if (this.$route.params.tableName === 'AD_TABLE') {
        console.log('extentionForTable() = ', extentionForTable());
        this.options = extentionForTable();
      } else {
        this.options = this.extentionConfig;
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
    }
  };
</script>

<style lang="less">
  .extentionInput {
    position: relative;
    textarea {
      resize: none;
    }
    i {
      font-size: 16px;
      position: absolute;
      right: 2px;
      bottom: 2px;
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
