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
            //             vuedisplay: "TabItem"
            // webact: "manage/pro_desc"
            const obj = { ...item };
            if (index === 0) {
              obj.label = this.activeTab.label;
              obj.componentAttribute.isactive = this.tabPanel[0].componentAttribute.buttonsData.data.isactive;
              obj.componentAttribute.watermarkimg = this.tabPanel[0].componentAttribute.buttonsData.data.watermarkimg;
              obj.componentAttribute.isMainTable = true;
            }

            obj.componentAttribute.isreftabs = this.tabPanel[0].componentAttribute.buttonsData.data.isreftabs;
            obj.componentAttribute.objreadonly = this.tabPanel[0].componentAttribute.buttonsData.data.objreadonly;
            obj.componentAttribute.tableName = item.tablename;
            obj.componentAttribute.changeData = this.updateData[item.tablename].changeData;
            obj.componentAttribute.itemInfo = item;
            obj.componentAttribute.childTableNames = this.childTableNames;
            obj.componentAttribute.tooltipForItemTable = this.tooltipForItem;
            obj.componentAttribute.type = 'horizontal';
            if (obj.vuedisplay === 'TabItem') {
              Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
              obj.componentAttribute.componentName = obj.webact.substring(obj.webact.lastIndexOf('/') + 1, obj.webact.length);
            } else {
              Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
            }
            obj.component = `tapComponent.${item.tablename}`;

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
          this.getMainTable(index, true);
        } else {
          if (this.tabPanel[index].tabrelation === '1:m') {
            const { tableName, itemId } = this.$route.params;
            const {
              tablename, refcolid, tableSearchData, tabinlinemode
            } = this.tabPanel[index];
            if (this.tabPanel[index].refcolid !== -1) {
              this.getInputForitemForChildTableForm({ table: this.tabPanel[index].tablename, tabIndex: index, tabinlinemode });
            }
            new Promise((resolve, reject) => {
              this.getObjectTabForChildTableButtons({
                maintable: tableName, table: tablename, objid: itemId, tabIndex: index, resolve, reject
              });
            }).then(() => {
              this.getObjectTableItemForTableData({
                table: tablename,
                objid: itemId,
                refcolid,
                searchdata: {
                  column_include_uicontroller: true,
                  startindex: (this.tablePageInfo.currentPageIndex - 1) * this.tablePageInfo.pageSize,
                  range: this.tablePageInfo.pageSize,
                  fixedcolumns: tableSearchData.selectedValue ? { [tableSearchData.selectedValue]: `${tableSearchData.inputValue}` } : {}
                },
                tabIndex: index
              });
            });
          } else if (this.tabPanel[index].tabrelation === '1:1') {
            const { tableName, itemId } = this.$route.params;
            const { tablename, refcolid } = this.tabPanel[index];
            this.getObjectTabForChildTableButtons({
              maintable: tableName, table: tablename, objid: itemId, tabIndex: index
            });
            this.getItemObjForChildTableForm({
              table: tablename, objid: itemId, refcolid, tabIndex: index
            });
          }
        }
      }, // tab切换触发的方法
      getMainTable(index, isNotFirstRequest) {
        const { tableName, itemId } = this.$route.params;
        // this.getObjectForMainTableForm({ table: tableName, objid: itemId });
        this.getObjectTabForMainTable({
          table: tableName, objid: itemId, tabIndex: index, isNotFirstRequest
        });
      }
    },
    activated() {

    },
    mounted() {
    },
    created() {
      this.getMainTable(this.tabCurrentIndex, false);
    }
  };
</script>

<style lang="less">
  .horizontalTableDetail {
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
