<template>
  <div class="horizontalTableDetail">
    <TabPanels
      type="line"
      is-keep-alive
      :tab-margin-left="20"
      :tab-panels="tabPanels"
    />
  </div>
</template>

<script>
  /* eslint-disable no-lonely-if */
  import { mapState } from 'vuex';
  import Vue from 'vue';
  import tabComponent from './SingleObjectTabComponent';

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab
      }),
      tabPanels() {
        const arr = [];
        if (this.tabPanel) {
          this.tabPanel.forEach((item, index) => {
            const obj = { ...item };
            if (index === 0) {
              obj.label = this.activeTab.label;
            }
            obj.componentAttribute.tableName = item.tablename;
            obj.componentAttribute.itemInfo = item;
            obj.componentAttribute.childTableNames = this.childTableNames;
            obj.componentAttribute.type = 'horizontal';
            Vue.component(`${item.tablename}_TapComponent`, Vue.extend(tabComponent));
            obj.component = `${item.tablename}_TapComponent`;
            obj.cilckCallback = this.tabClick;
            arr.push(obj);
          });
        }
        return arr;
      }
    },
    methods: {
      tabClick(index) {
        this.updateTabCurrentIndex(index);
        if (index === 0) {
          this.getMainTable();
        } else {
          if (this.tabPanel[index].tabrelation === '1:m') {
            if (this.tabPanel[index].refcolid !== -1) {
              this.getInputForitemForChildTableForm({ table: this.tabPanel[index].tablename });
            }
            const { tableName, itemId } = this.$route.params;
            const { tablename, refcolid } = this.tabPanel[index];
            this.getObjectTabForChildTableButtons({ maintable: tableName, table: tablename, objid: itemId });
            this.getObjectTableItemForTableData({
              table: tablename, objid: itemId, refcolid, searchdata: { column_include_uicontroller: true }
            });
          } else if (this.tabPanel[index].tabrelation === '1:1') {
            const { tableName, itemId } = this.$route.params;
            const { tablename, refcolid } = this.tabPanel[index];
            this.getObjectTabForChildTableButtons({ maintable: tableName, table: tablename, objid: itemId });
            this.getItemObjForChildTableForm({ table: tablename, objid: itemId, refcolid });
          }
        }
      }, // tab切换触发的方法
      getMainTable() {
        const { tableName, itemId } = this.$route.params;
        // this.getObjectForMainTableForm({ table: tableName, objid: itemId });
        this.getObjectTabForMainTable({ table: tableName, objid: itemId });
      }
    },
    activated() {

    },
    mounted() {
    },
    created() {
      this.getMainTable();
    }
  };
</script>

<style lang="less">
  .horizontalTableDetail {
    padding: 0 16px;
    flex: 1;
    height: 100%;
    overflow: hidden;
    .burgeon-tabs-panels{
      height: 100%;
      display: flex;
      flex-direction: column;
      .burgeon-tabs-panels-content{
        flex: 1;
        overflow: hidden;
        height: 100%;
      }
    }
  }

</style>
