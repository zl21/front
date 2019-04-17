<template>
  <div class="tabComponent">
    <component
      :is="'SingleObjectButtons'"
      v-if="buttonsData.isShow"
      :object-type="type"
      class="objectButtons"
      :item-name="tableName"
      :tabcmd="buttonsData.data.tabcmd"
      :tabwebact="buttonsData.data.tabwebact"
    />
    <component
      :is="'CompositeForm'"
      v-if="formData.isShow"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      :module-form-type="type"
      class="form"
      :default-data="formData.data"
      @formChange="formChange"
      @InitializationForm="initForm"
      @VerifyMessage="verifyForm"
    />
    <component
      :is="'CompositeFormPanel'"
      v-if="panelData.isShow"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      :module-form-type="type"
      class="formPanel"
      type="PanelForm"
      :default-data="panelData.data"
      @formChange="formPanelChange"
      @InitializationForm="initFormPanel"
      @VerifyMessage="verifyFormPanel"
    />
    <component
      :is="'TableDetailCollection'"
      v-if="tableData.isShow"
      class="objectTable"
      :tableHeight="type === 'vertical'? 300: 0"
      :table-name="tableName"
      :data-source="tableData.data"
      :type="type"
      :readonly="buttonsData.data.objreadonly"
      @tableBeforeData="tableBeforeData"
      @tableDataChange="tableDataChange"
      @tableSelectedRow="tableSelectedRow"
      @tableVerifyMessage="tableVerifyMessage"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import tableDetailCollection from './TableDetailCollection';
  import singleObjectButtons from './SingleObjectButtons';
  import compositeForm from './CompositeForm';
  import horizontalMixins from '../__config__/mixins/horizontalTableDetail';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';
  import getModuleName from '../__utils__/getModuleName';

  export default {
    data() {
      return {
      };
    },
    components: {
    },
    props: {
      type: {
        type: String,
        default: 'vertical'
      },
      tableName: {
        type: String,
        default: ''
      },
      tableId: {
        type: String,
        default: ''
      },
      tableData: {
        type: Object,
        default: () => ({})
      }, // 表格数据
      buttonsData: {
        type: Object,
        default: () => ({})
      }, // 按钮数据
      formData: {
        type: Object,
        default: () => ({})
      }, // 表单数据
      panelData: {
        type: Object,
        default: () => ({})
      } // 面板数据
    },
    watch: {},
    computed: {
    },
    mounted() {
      // this.generateComponent();
    },
    created() {
      this.generateComponent();
    },
    methods: {
      generateComponent() {
        if (this.type === 'vertical') {
          Vue.component('TableDetailCollection', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, tableDetailCollection)));
          Vue.component('SingleObjectButtons', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, singleObjectButtons)));
          Vue.component('CompositeFormPanel', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, compositeForm)));
          Vue.component('CompositeForm', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, compositeForm)));
        } else {
          Vue.component('TableDetailCollection', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, tableDetailCollection)));
          Vue.component('SingleObjectButtons', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, singleObjectButtons)));
          Vue.component('CompositeFormPanel', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, compositeForm)));
          Vue.component('CompositeForm', Vue.extend(Object.assign({ mixins: [horizontalMixins()] }, compositeForm)));
        }
      },
      formChange(val) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId === '-1') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: obj });
        } else {
          this.$store.commit(`${getModuleName()}/updateModifyData`, { tableName, value: obj });
        }
      },
      initForm(val) {
        const { tableName } = this;
        const obj = {};
        obj[tableName] = val;
        this.$store.commit(`${getModuleName()}/updateDefaultData`, { tableName, value: obj });
      },
      verifyForm(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateCheckedInfoData`, { tableName, value: data });
      },
      verifyFormPanel(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateCheckedInfoData`, { tableName, value: data });
      },
      formPanelChange(val) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId === '-1') {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: obj });
        } else {
          this.$store.commit(`${getModuleName()}/updateModifyData`, { tableName, value: obj });
        }
      },
      initFormPanel(val) {
        const { tableName } = this;
        const obj = {};
        obj[tableName] = val;
        this.$store.commit(`${getModuleName()}/updateDefaultData`, { tableName, value: obj });
      },
      tableBeforeData(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateDefaultData`, { tableName, value: data });
      },
      tableDataChange(data) {
        const { tableName } = this;
        const { itemId } = this.$route.params;
        if (itemId === -1) {
          this.$store.commit(`${getModuleName()}/updateAddData`, { tableName, value: data });
        } else {
          this.$store.commit(`${getModuleName()}/updateModifyData`, { tableName, value: data });
        }
      },
      tableSelectedRow(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateDeleteData`, { tableName, value: data });
      },
      tableVerifyMessage(data) {
        const { tableName } = this;
        this.$store.commit(`${getModuleName()}/updateCheckedInfoData`, { tableName, value: data });
      }
    }
  };
</script>

<style lang="less">
  .tabComponent{
    height: 100%;
    display: flex;
    flex-direction: column;
    .objectButtons {
      .buttonList {
        padding-left: 0;
      }
    }
    .form {
      padding: 0 10px 8px 10px;
      background-color: #F8F8F8;
    }
    .formPanel {
      flex: 1;
      overflow-y: auto;
    }
    .objectTable {
    }
  }
</style>
