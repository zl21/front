<template>
  <div
    :id="currentTableName"
    class="horizontalTableDetail"
  >
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
  import { mapState, mapMutations } from 'vuex';
  import Vue from 'vue';
  import tabComponent from './SingleObjectTabComponent';
  import { DispatchEvent } from '../__utils__/dispatchEvent';


  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,
        isRequest: ({ isRequest }) => isRequest,

      }),
      resetWaterMark() {
        if (this.tabPanel[0].componentAttribute.buttonsData.data.watermarkimg) {
          return this.tabPanel[0].componentAttribute.buttonsData.data.watermarkimg;
        }
        return '';
      },
      
      tabPanels() {
        const arr = [];
       
        if (this.tabPanel) {
          this.tabPanel.forEach((item, index) => {
            const obj = { ...item };
            if (index === 0) {
              obj.label = this.activeTab.label;
              obj.componentAttribute.isactive = this.tabPanel[0].componentAttribute.buttonsData.data.isactive;
              obj.componentAttribute.watermarkimg = this.tabPanel[0].componentAttribute.buttonsData.data.watermarkimg;
              // obj.componentAttribute.jflowWaterMark = this.jflowWaterMark;
              obj.componentAttribute.isMainTable = true;     
              obj.componentAttribute.objreadonly = this.tabPanel[0].componentAttribute.buttonsData.data.objreadonly || this.tabPanel[0].componentAttribute.panelData.data.isdefault;
            } 
            obj.componentAttribute.objreadonly = this.tabPanel[0].componentAttribute.buttonsData.data.objreadonly || this.childReadonly;
            obj.componentAttribute.webConfSingle = this.tabPanel[index].componentAttribute.buttonsData.data.webconf;
            obj.componentAttribute.isreftabs = this.tabPanel[0].componentAttribute.buttonsData.data.isreftabs;
            obj.componentAttribute.tableName = item.tablename;
            obj.componentAttribute.formReadonly = this.tabPanel[0].componentAttribute.buttonsData.data.objreadonly;
            obj.componentAttribute.changeData = this.updateData[item.tablename].changeData;
            obj.componentAttribute.itemInfo = item;
            obj.componentAttribute.childTableNames = this.childTableNames;
            obj.componentAttribute.tooltipForItemTable = this.tooltipForItem;
            obj.componentAttribute.type = 'horizontal';
            let webactType = '';
            if (obj.webact) { // 自定义tab全定制，tab切换时不需要请求，且不显示单对象按钮组件
              webactType = obj.webact.substring(0, obj.webact.lastIndexOf('/')).toUpperCase();
            }
            if (obj.vuedisplay === 'TabItem') { // 引入自定义组件
              Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
              obj.componentAttribute.componentName = obj.webact.substring(obj.webact.lastIndexOf('/') + 1, obj.webact.length);// 自定义组件名称
              obj.componentAttribute.componentType = webactType;// 自定义组件类型ALL/HALF
              obj.componentAttribute.itemInfo = item;
            } else {
              if (Vue.component(`tapComponent.${item.tablename}`) === undefined) {
                Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
              }
            }
            if (webactType === 'HALF') { // 如果是自定义tab全定制界面时，不需要引入公共组件,半定制界面需要引入公共组件
              this.updateButtonsDataForCustomization({ tabIndex: index, isShowValue: false });
            }
            obj.component = `tapComponent.${item.tablename}`;
            obj.cilckCallback = this.tabClick;
            obj.isRequest = false;
            if (this.WebConf && this.WebConf.isCustomizeTab) {
              if (index === 1) {
                obj.componentAttribute.isCustomizeMainTable = true;
              }
              if (index !== 0) {
                arr.push(obj);
              }
            } else {
              arr.push(obj);
            }
          });
        }

        return arr;
      },
      currentTableName() {
        return this.$route.params.tableName;
      }
    },
    methods: {
      
      ...mapMutations('global', ['isRequestUpdata', 'emptyTestData']),
 
      tabClick(index) {
        let flag = false;
        if (this.isRequest.length > 0 && this.isRequest[index] === true) {
          flag = true;
        }
        if (this.WebConf && this.WebConf.isCustomizeTab) {
          index += 1;
        }
        this.updateTabCurrentIndex(index);
        DispatchEvent('tabClick', {
          detail: {
            data: this.tabPanel[index],
            index
          }
        });
        if (!flag) {
          if (index === 0) { // 主表
            this.getMainTable(index, true);
          } else { // 子表
            let webactType = '';
            if (this.tabPanel[index].webact) { // 自定义tab全定制，tab切换时不需要请求
              webactType = this.tabPanel[index].webact.substring(0, this.tabPanel[index].webact.lastIndexOf('/'));
            }
            if (webactType !== 'ALL') {
              if (this.tabPanel[index].tabrelation === '1:m') { // 有表格
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
                  const {
                    tableDefaultFixedcolumns
                  } = this.tabPanel[index];
                  this.getObjectTableItemForTableData({
                    table: tablename,
                    objid: itemId,
                    refcolid,
                    searchdata: {
                      column_include_uicontroller: true,
                      startindex: (this.tabPanel[index].tablePageInfo.currentPageIndex - 1) * this.tablePageInfo.pageSize,
                      range: this.tabPanel[index].tablePageInfo.pageSize,
                      fixedcolumns: tableSearchData.selectedValue ? { [tableSearchData.selectedValue]: `${tableSearchData.inputValue}` } : tableDefaultFixedcolumns
                    },
                    tabIndex: index
                  });
                });
              } else if (this.tabPanel[index].tabrelation === '1:1') { // 无表格只有面板
                const { tableName, itemId } = this.$route.params;
                const { tablename, refcolid } = this.tabPanel[index];
                new Promise((resolve, reject) => {
                  this.getObjectTabForChildTableButtons({
                    maintable: tableName, table: tablename, objid: itemId, tabIndex: index, resolve, reject
                  });
                }).then(() => {

                });
               
                this.getItemObjForChildTableForm({
                  table: tablename, objid: itemId, refcolid, tabIndex: index
                });
              }
            }
          }
        }
        if (this.WebConf && this.WebConf.isCustomizeTab) {
          const i = index - 1;
          this.isRequestUpdata({ tabPanel: this.tabPanels, index: i });
        } else {
          this.isRequestUpdata({ tabPanel: this.tabPanels, index });
        }
      }, // tab切换触发的方法
      getMainTable(index, isNotFirstRequest) {
        const { tableName, itemId } = this.$route.params;
        // this.getObjectForMainTableForm({ table: tableName, objid: itemId });
        new Promise((resolve, reject) => {
          this.getObjectTabForMainTable({
            table: tableName, objid: itemId, tabIndex: index, isNotFirstRequest, isFirstRequest: true, resolve, reject
          });
        }).then((resData) => {
          // if (resData.webconf && resData.webconf.isCustomizeTab) {
          //   console.log(111, this.tabPanels);
          //   this.isRequestUpdata({ tabPanel: this.tabPanels, index: 1 });
          // } else {
          this.isRequestUpdata({ tabPanel: this.tabPanels, index: 0 });
          // }
          DispatchEvent('uploadCustomTab', {
            detail: {
              data: resData
            }
          });
        });
      }
    },
    activated() {

    },
    mounted() {
      this.getMainTable(this.tabCurrentIndex, false);
      setTimeout(() => {
        const query = this.$route.query.ACTIVE;
        const oUl = document.querySelector('.ark-tabs-panels-nav');
        if (query && oUl) {
          for (let i = 0; i < oUl.children.length; i++) {
            this.tabPanels.forEach((item) => {
              if (Number(query) === item.tableid && item.tabledesc === oUl.children[i].innerText) {
                oUl.children[i].click();
              }
            });
          }
        }
      }, 1000);
    },
    created() {
      // this.emptyTestData();
    }
  };
</script>

<style lang="less">
  .horizontalTableDetail {
    flex: 1;
    height: 100%;
    overflow: hidden;
    .ark-tabs-panels{
      height: 100%;
      display: flex;
      flex-direction: column;
      .ark-tabs-panels-content{
        flex: 1;
        overflow: hidden;
        height: 100%;
      }
    }
  }

</style>
