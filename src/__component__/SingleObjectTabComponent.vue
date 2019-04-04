<template>
  <div class="tabComponent">
    <component
      :is="'SingleObjectButtons'"
      v-if="buttonsData.isShow"
      class="objectButtons"
      :tabcmd="buttonsData.data.tabcmd"
      :tabwebact="buttonsData.data.tabwebact"
    />
    <component
      :is="'CompositeForm'"
      v-if="formData.isShow"
      class="form"
      :default-data="formData.data"
    />
    <component
      :is="'CompositeFormPanel'"
      v-if="panelData.isShow"
      class="formPanel"
      type="PanelForm"
      :default-data="panelData.data"
    />
    <component
      :is="'TableDetailCollection'"
      v-if="tableData.isShow"
      class="objectTable"
      :data-source="tableData.data"
      :type="type"
      :readonly="buttonsData.data.objreadonly"
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

  export default {
    data() {
      return {
      };
    },
    name: 'SingleObjectTabComponent',
    components: {
    },
    props: {
      type: {
        type: String,
        default: 'vertical'
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
      margin-bottom: 10px;
      padding: 4px 10px;
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
