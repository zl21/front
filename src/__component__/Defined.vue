<template>
  <component
    :is="componentName"
    :storage-item="storageItem"
    :readonly="items.props.readonly"
    :itemdata="items.props"
    v-bind="$attrs"
    v-on="$listeners"
    @objSave="objSave"
  />
</template>

<script>
  import Vue from 'vue';
  import PageNotFound from './PageNotFound.vue';
  import customize from '../__config__/customizeDialog.config';

  const customizeModules = {};
  Object.keys(customize).forEach((key) => {
    customizeModules[key.toUpperCase()] = customize[key];
  });
  export default {
    // name: 'DialogComponent',
    components: {
      PageNotFound
    },
    data() {
      return {
        componentName: null,
        storageItem: {
          id: this.$route.params.tableId,
          name: this.$route.params.tableName,
          tableid: this.$route.params.itemId
        }
      };
    },
    props: {
      itemdata: {
        type: Object
      },
      objList: {// 返回所有的数据，全部数据
        type: Array
      },
      isActive: {
        type: Boolean,
        default: true
      },
      isdisabled: {
        type: Boolean
      },
      items: {
        type: Object
      },
      refaddcol: null,
    },
    computed: {

    },
    watch: {
      
    },
    mounted() {
      this.generateComponent();
    },
    methods: {
      objSave() {
        const currentTableDom = document.getElementById(this.storageItem.name);
        const dom = currentTableDom.getElementById('actionMODIFY');
        const myEvent = document.createEvent('HTMLEvents');
        myEvent.initEvent('click', false, true);
        dom.dispatchEvent(myEvent);
      },
      generateComponent() {
        // window.ProjectConfig.custommizeMainTableField = customizeModules;
        if (window.ProjectConfig && window.ProjectConfig.custommizeMainTableField) {
          let target = '';

          if (this.items.props.webconf && this.items.props.webconf.definedType) {
            this.componentName = `${this.storageItem.name}_${this.items.props.webconf.definedType}`;
            target = window.ProjectConfig.custommizeMainTableField[this.items.props.webconf.definedType]; 
          } else {
            this.componentName = `${this.storageItem.name}_${this.items.props.colname}`;
            target = window.ProjectConfig.custommizeMainTableField[this.items.props.colname];
          }
          console.log(target);
          if (Vue.component(this.componentName) === undefined) {
            if (target) {
              if (typeof target.component === 'function') {
                Vue.component(this.componentName, target.component);
              } else {
                Vue.component(this.componentName, target);
              }
              this.items.componentType = this.componentName;
            } else {
              Vue.component(this.componentName, PageNotFound);
              this.items.componentType = this.componentName;
            }
          } else {
            this.items.componentType = this.componentName;
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
 
</style>
