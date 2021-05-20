<template>
  <component
    :is="componentName"
    :options='items'
    @change="onChange"
    @save="onSave"
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
    name: 'Defined',

    components: {
      PageNotFound
    },

    model: {
      prop: 'value',
      event: 'change'
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
      items: {
        type: Object
      },
      value: {
        default: null
      }
      // refaddcol: null,
    },

    mounted() {
      this.generateComponent();
    },

    methods: {
      // 改变值
      onChange(e) {
        this.$emit('change', e)
      },

      // 触发保存按钮
      onSave() {
        const currentTableDom = document.querySelector(`#${this.storageItem.name}`);
        const dom = currentTableDom.querySelector('#actionMODIFY');
        const myEvent = document.createEvent('HTMLEvents');
        myEvent.initEvent('click', false, true);
        dom.dispatchEvent(myEvent);
      },

      // 生成组件
      generateComponent() {
        // window.ProjectConfig.customizeMainTableField = customizeModules;
        if (window.ProjectConfig && window.ProjectConfig.customizeMainTableField) {
          let target = '';

          if (this.items.webconf && this.items.webconf.definedType) {
            this.componentName = `${this.storageItem.name}_${this.items.webconf.definedType}`;
            target = window.ProjectConfig.customizeMainTableField[this.items.webconf.definedType]; 
          } else {
            this.componentName = `${this.storageItem.name}_${this.items.colname}`;
            target = window.ProjectConfig.customizeMainTableField[this.items.colname];
          }
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
