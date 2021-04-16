<template>
  <div
    :id="currentTableName"
    class="verticalTableDetail"
  >
    <component
      :is="currentSingleButtonComponentName"
      :tabcmd="mainFormInfo.buttonsData.data.tabcmd"
      object-type="vertical"
      :item-table-check-func="itemTableCheckFunc"
      :isreftabs="mainFormInfo.buttonsData.data.isreftabs"
      :isactive="mainFormInfo.buttonsData.data.isactive"
      :watermarkimg="resetWaterMark"
      :item-name-group="childTableNames"
      :item-info="mainFormInfo"
      :tabwebact="mainFormInfo.buttonsData.data.tabwebact"
      :item-name="getItemName"
      :is-main-form="mainFormInfo"
    />
    <div class="verticalTableDetailContent">
      <!-- 上下结构主表 form-->

      <!-- <div>
        <label>
          自定义界面:
        </label>
        <Select
          v-model="customizeValue"
          style="width:200px"
        >
          <Option
            v-for="(item,key) in customizeDataRes"
            :key="key"
            :value="key"
          >
            {{ item.label }}
          </Option>
        </Select>
      </div>
      <div style="margin-top:10px;">
        <label style="float:left">
          路由:
        </label>
        <AutomaticPathGenerationInput />
      </div> -->
      <panelForm
        :tableName="$route.params.tableName"
        :readonly="mainFormInfo.buttonsData.data.objreadonly"
        :defaultData="Object.keys(defaultDataForCopy).length>0?defaultDataForCopy.data:mainFormInfo.formData.data"
      ></panelForm>
      <!-- <composite-form
        v-if="mainFormInfo.formData.isShow"
        class="compositeAllform"
        object-type="vertical"
        :is-main-table="true"
        :web-conf-single="mainFormInfo.buttonsData.data.webconf"
        :objreadonly="mainFormInfo.buttonsData.data.objreadonly || mainFormInfo.formData.data.isdefault"
        :readonly="mainFormInfo.buttonsData.data.objreadonly"
        :default-set-value="updateData[this.$route.params.tableName]? updateData[this.$route.params.tableName].changeData:{}"
        :master-name="$route.params.tableName"
        :master-id="$route.params.itemId"
        module-form-type="vertical"
        :default-data="Object.keys(defaultDataForCopy).length>0?defaultDataForCopy.data:mainFormInfo.formData.data"
        :paths="formPaths"
        :isreftabs="mainFormInfo.buttonsData.data.isreftabs"
        :child-table-name="getItemName"
        :from="from"
        type="PanelForm"
        @formChange="formChange"
        @InitializationForm="InitializationForm"
        @VerifyMessage="verifyFormPanelMain"
      /> -->
      <div class="verticalTabs">
        <TabPanels
          v-show="tabPanels.length > 0"
          ref="tabPanel"
          class="tabPanel"
          :tab-margin-left="20"
          is-keep-alive
          :type="'singleCard'"
          :tab-panels="tabPanels"
        />
      </div>
    <!-- <TableDetailCollection
      :data-source="dataSource"
      @tableSearch="getRefTableSearchList"
    /> -->
    </div>
  </div>
</template>

<script>
  /* eslint-disable consistent-return */

  import { mapState, mapMutations } from 'vuex';
  import Vue from 'vue';
  // import getComponentName from '../__utils__/getModuleName';
  import tabComponent from './SingleObjectTabComponent.vue';
  import AutomaticPathGenerationInput from './AutomaticPathGenerationInput.vue';
  
  import {
    MODULE_COMPONENT_NAME, notificationOfMain
  } from '../constants/global';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';

  import customizeData from '../__config__/customize.config';
  import singleObjectButtons from './SingleObjectButtons.vue';
  import compositeForm from './CompositeForm.vue';
  import { DispatchEvent } from '../__utils__/dispatchEvent';


  export default {
    // name: 'VTableDetail',
    watch: {
    },
    data() {
      return {
        customizeValue: '',
        currentSingleButtonComponentName: null,  //按钮组件
        from: 'singlePage',
      };
    },
    computed: {
      // ...mapState('global', {
      //   isRequest: ({ isRequest }) => isRequest,
      // }),
      customizeDataRes() {
        const obj = {};
        return Object.keys(customizeData).reduce((arr, key) => {
          arr.push(obj[key] = customizeData[key]);  
          return arr;
        }, []);
      },
      resetWaterMark() {
        if (this.mainFormInfo.buttonsData.data.watermarkimg) {
          return this.mainFormInfo.buttonsData.data.watermarkimg;
        }
        return '';
      },

      tabPanels() {
        const arr = [];
        if (this.tabPanel[0] && this.tabPanel[0].vuedisplay && this.tabPanel[0].vuedisplay === 'TabItem') {
          DispatchEvent('uploadCustomTab', {
            detail: {
              data: this.tabPanel[0]
            }
          });
        }
        this.tabPanel.forEach((item, index) => {
          const obj = { ...item };
          obj.componentAttribute.itemInfo = item;
          obj.componentAttribute.tableName = item.tablename;
          obj.componentAttribute.changeData = this.updateData[item.tablename].changeData;
          if (this.mainFormInfo.buttonsData) {
            obj.componentAttribute.isreftabs = this.mainFormInfo.buttonsData.data.isreftabs;
            obj.componentAttribute.objreadonly = this.mainFormInfo.buttonsData.data.objreadonly || this.childReadonly;
            obj.componentAttribute.formReadonly = this.mainFormInfo.buttonsData.data.objreadonly;
            obj.componentAttribute.status = this.mainFormInfo.buttonsData.data.status;
            obj.componentAttribute.webConfSingle = this.mainFormInfo.buttonsData.data.webconf;
          } 
          obj.componentAttribute.watermarkimg = obj.componentAttribute.panelData.data.watermarkimg;// 子表水印
          obj.componentAttribute.webConfSingle = obj.componentAttribute.buttonsData.data.webconf;
          obj.componentAttribute.childTableNames = this.childTableNames;
          obj.componentAttribute.mainFormPaths = this.formPaths;
          obj.componentAttribute.tooltipForItemTable = this.tooltipForItem;
          obj.componentAttribute.type = 'vertical';
          if (obj.vuedisplay === 'TabItem') { // 配置自定义tab
            const webact = obj.webact ? obj.webact.split('/')[0].toUpperCase() : '';// 自定义子表标识
            if (webact === 'HALF' || webact === 'ALL') {
              Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
              obj.componentAttribute.componentName = obj.webact.substring(obj.webact.lastIndexOf('/') + 1, obj.webact.length);
            } 
          } else if (Vue.component(`tapComponent.${item.tablename}`) === undefined) {
            Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
          }
          obj.component = `tapComponent.${item.tablename}`;
          obj.cilckCallback = this.tabClick;
          arr.push(obj);
        });
        return arr;
      },
      currentTableName() {
        return this.$route.params.tableName;
      },
      formPaths() {
        if (this.mainFormInfo.buttonsData.data && this.mainFormInfo.buttonsData.data.tabcmd && this.mainFormInfo.buttonsData.data.tabcmd.paths) {
          return this.mainFormInfo.buttonsData.data.tabcmd.paths;
        }
        return [];
      },
      getItemName() {
        if (this.tabPanel.length > 0) {
          return this.tabPanel[this.tabCurrentIndex].tablename;
        }
        return '';
      },
    },
    components: {
      compositeForm,
      AutomaticPathGenerationInput
    },
    created() {
      // this.emptyTestData();
    },
    mounted() {
      const singleButtonComponentName = `${this[MODULE_COMPONENT_NAME]}.SingleObjectButtons`;
      if (Vue.component(singleButtonComponentName) === undefined) {
        Vue.component(singleButtonComponentName, Vue.extend(Object.assign({ mixins: [verticalMixins()] }, singleObjectButtons)));
      }
      this.currentSingleButtonComponentName = singleButtonComponentName;


      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });

      const promise = new Promise((resolve, reject) => {
        this.getObjectTabForMainTable({
          table: tableName, objid: itemId, tabIndex: this.tabCurrentIndex, resolve, reject
        });
      });
      this.isRequestUpdata({ tabPanel: this.tabPanels, index: 0 });

      const interval = setInterval(() => {
        const query = this.$route.query.ACTIVE;
        const oUl = document.querySelector('.ark-tabs-panels-nav');
        if (query && oUl) {
          for (let i = 0; i < oUl.children.length; i++) {
            this.tabPanels.forEach((item) => {
              if (Number(query) === item.tableid && item.tabledesc === oUl.children[i].innerText) {
                if (oUl.children[i].click && typeof oUl.children[i].click === 'function') {
                  clearInterval(interval);
                  oUl.children[i].click();
                }
              }
            });
          }
        }
      }, 1000);// 每1秒轮询一次，10次结束，
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    },
    methods: {
      // ...mapMutations('global', ['isRequestUpdata', 'emptyTestData']),

      itemTableCheckFunc() {
        if (this.$refs.tabPanel) {
          const index = this.$refs.tabPanel.$children.findIndex(item => item.tableName === this.tabPanel[this.tabCurrentIndex].tablename);
          if (index > -1) {
            return this.$refs.tabPanel.$children[index].itemTableCheckFunc();
          }
          return true;
        }
        return true;
      }, // 按钮点击保存的回调
      InitializationForm(val, val2, valLabel) {
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        const objLabel = {};
        obj[tableName] = val;
        objLabel[tableName] = valLabel;
        if (itemId) {
          if (itemId === 'New') {
            this.updateAddData({ tableName, value: obj });
          }
          this.updateDefaultData({ tableName, value: obj });
          this.updateDefaultLabelData({ tableName, value: objLabel });
        }
      },
      formChange(val, changeVal, valLabel) {
        // 主表数据修改时抛出event事件
        if (notificationOfMain()) {
          DispatchEvent('notificationOfMain', {
            detail: val
          });
        }
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        const objLabel = {};
        obj[tableName] = val;
        objLabel[tableName] = valLabel;
        if (itemId) {
          this.updateChangeData({ tableName, value: changeVal });
          if (itemId === 'New') {
            this.updateAddData({ tableName, value: obj });
          } else {
            this.updateModifyData({ tableName, value: obj });
            this.updateModifyLabelData({ tableName, value: objLabel });
          }
        }
      },
      verifyFormPanelMain(data) {
        const { tableName, itemId } = this.$route.params;
        if (itemId) {
          this.updateCheckedInfoData({ tableName, value: data });
        }
      },
      tabClick(index) {
        DispatchEvent('tabClick', {
          detail: {
            data: this.tabPanel[index]
          }
        });
        // tab点击
        this.updateTabCurrentIndex(index);
        let flag = false;
        if (this.isRequest && this.isRequest.length > 0 && this.isRequest[index] === true) {
          flag = true;
        }
        let webactType = '';
        if (this.tabPanel[index].webact) { // 自定义tab全定制，tab切换时不需要请求
          webactType = this.tabPanel[index].webact.substring(0, this.tabPanel[index].webact.lastIndexOf('/')).toUpperCase();
        }
        if (!flag) {
          // if (index === this.tabCurrentIndex) {
          //   return;
          // }

          if (webactType === 'HALF' || !webactType) {
            const { itemId } = this.$route.params;
            const refTab = this.tabPanel[index];
            let getButtonDataPromise = null;
            if (this.tabPanels[index].componentAttribute.refcolid !== -1) {
              // 获取子表表单
              if (refTab.tabrelation !== '1:1') {
                getButtonDataPromise = new Promise((rec, rej) => {
                  this.getObjectTabForRefTable({
                    table: refTab.tablename, objid: itemId, tabIndex: index, rec, rej
                  });
                });
              }
            
              const formParam = {
                table: refTab.tablename,
                inlinemode: refTab.tabinlinemode,
                tabIndex: index
              };
              this.getFormDataForRefTable(formParam);
            }
            if (refTab.tabrelation === '1:m') {
              getButtonDataPromise.then(() => {
                this.getObjectTableItemForTableData({
                  table: refTab.tablename,
                  objid: itemId,
                  refcolid: refTab.refcolid,
                  searchdata: {
                    column_include_uicontroller: true,
                    startindex: (this.tabPanel[index].tablePageInfo.currentPageIndex - 1) * this.tablePageInfo.pageSize,
                    range: this.tabPanel[index].tablePageInfo.pageSize,
                    fixedcolumns: refTab.tableSearchData.selectedValue ? { [refTab.tableSearchData.selectedValue]: `${refTab.tableSearchData.inputValue}` } : refTab.tableDefaultFixedcolumns
                  },
                  tabIndex: index
                });
              });
            } else if (refTab.tabrelation === '1:1') {
              getButtonDataPromise = new Promise((rec, rej) => {
                this.getObjectTabForRefTable({
                  table: refTab.tablename, objid: itemId, tabIndex: index, rec, rej
                });
              });
              this.getItemObjForChildTableForm({
                table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid, tabIndex: index
              });
            }
          }
        }
        this.isRequestUpdata({ tabPanel: this.tabPanels, index });
      },
    },
  };
</script>

<style lang="less" scoped >
  .verticalTableDetail {
   height: 100%;
    display: flex;
    flex-direction: column;
    .verticalTableDetailContent{
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .verticalTabs{
      flex: 1;

      *{
        flex-shrink: 0;
      }

      .verticalFormPanel{
        flex: none;
      }
      
      .tabComponent,.ark-tabs-panels{
        height: auto;
      }
      

      /deep/ .verticalFormPanel{
        flex: none;
      }
    }
    .tabPanel {
      margin: 10px 0;
    }
  }
</style>
