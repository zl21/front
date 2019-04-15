<template>
  <div class="singleObjectButton">
    <ButtonGroup
      :data-array="dataArray"
      class="buttonGroup"
      @buttonClick="buttonClick"
    />
    <Dialog 
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
    />
  </div>
</template>

<script>
  // import { mapState } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';
  // import moduleName from '../__utils__/getModuleName';
  import router from '../__config__/router.config';
  import Dialog from './Dialog.vue';
  

  export default {
    data() {
      return {
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        },
        
        dataArray: {
          refresh: true, // 显示刷新
          back: true, // 显示刷新
          printValue: false, // 是否显示打印
          actionCollection: false,
          collectiImg: false, // 是否收藏
          waListButtonsConfig: {// 自定义按钮
            waListButtons: []
          },
          buttonGroupShowConfig: {// 标准按钮
            buttonGroupShow: []
          },
          btnclick: (type, item) => {
            const self = this;
            return self.buttonClick(type, item);
          }
        },
        dynamicRequestUrl: {}, // 用于记录某个按钮点击后，如果将会产生请求，维护请求路径path
        tableName: '', // 主表表名
        tableId: '', // 主表ID
        itemId: '', // 子表ID
        currentParameter: {},
        buttonShowType: '', // 判断按钮显示条件
        dynamicUrl: ''// 保存url
      };
    },
    name: 'SingleObjectButtons',
    components: {
      ButtonGroup,
      Dialog
    },
    watch: {
      tabcmd: {
        handler(val) {
          if (this.buttonShowType !== 'add') {
            this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
            this.getbuttonGroupData(val);
          } else { // 编辑新增时处理按钮数据，只显示保存和返回
            // this.modifyButtonData();
            this.dataArray.refresh = false;
            this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
            this.addButtonShow(val);
          }
        },
        deep: true
      },
    },
    computed: {
    
      
    },
    props: {
      tabcmd: {
        type: Object,
        default: () => ({})
      },
      tabwebact: {
        type: Object,
        default: () => ({})
      },
      objectType: {
        type: String,
        default: ''
      },
      itemName: {
        type: String,
        default: ''
      },
      hasTabPanels: {// 用来判断是否有子表
        type: Number,
        default: 0
      },
    },
    methods: {
      getdynamicRequestUrl(buttonData) { // 获取接口返回路径
        buttonData.forEach((d) => {
          if (d.eName === 'actionMODIFY') {
            this.dynamicUrl = d.requestUrlPath;
          }
        });
      },
      buttonClick(type, obj) {
        if (type === 'fix') {
          this.objectTabAction(obj);
        } else if (type === 'custom') {
          this.webactionClick(type, obj);
        } else if (type === 'Collection') {
          this.clickButtonsCollect();
        } else if (type === 'back') {
          this.clickButtonsBack();
        } else if (type === 'refresh') {
          this.clickButtonsRefresh();
        } else {
          this.searchClickData();
        }
     
        // }, 300);
      },
      objectTabAction(obj) {
        // clearTimeout(window.timer);

        // window.timer = setTimeout(() => {
        switch (obj.eName) {
        case 'actionADD': // 新增
          this.objectAdd();
          break;
        case 'actionMODIFY': // 保存
          this.objectSave(obj);
          break;
        case 'actionEXPORT': // 导出
          this.objectEXPORT();
          break;
        case 'actionGROUPSUBMIT': // 批量提交
          this.objectGROUPSUBMIT();
          break;
        case 'actionDELETE': // 删除
          this.objectTryDelete(obj);
          break;
        case 'actionSUBMIT': // 提交
          this.objectTrySubmit();
          break;
        case 'actionUNSUBMIT': // 取消提交
          this.objectTryUnSubmit();
          break;
        case 'actionVOID': // 作废
          this.objectTryVoid();
          break;
        case 'actionCANCOPY': // 复制
          this.copyFlag = true;
          this.objectCopy();

          break;
        case 'actionCopyBill':
          this.objectCopyBill();
          break;
        default:
          break;
        }
      },
    
      clickButtonsBack() {
        const { tableId, tableName } = this.$route.params;
        const param = {
          tableId,
          tableName,
          back: true,
        };
       
        this.$store.commit('global/tabHref', param);
      },
      getbuttonGroupData(tabcmd) {
        const tabcmdData = tabcmd;
        if (this.itemId !== '-1') {
          if (tabcmdData.cmds) {
            tabcmdData.cmds.forEach((item, index) => {
              if (tabcmdData.prem[index]) {
                const type = item.split('action');
                const str = `CMD_${type[1].toUpperCase()}`;
                if (str === 'CMD_PRINT') {
                  this.dataArray.printValue = true;
                } else {
                  const buttonConfigInfo = this.buttonMap[str];
                  this.buttonMap[str].eName = item;
                  buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
                  this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                }
              }
            });
          }
        } else if (tabcmdData.cmds) { // 判断新增编辑按钮显示条件
          console.log('🧜‍♀️🧜‍♂️', tabcmdData.cmds);
          this.addButtonShow(tabcmd);
        }
      },
      addButtonShow(tabcmd) { // 判断按钮显示的条件是否为新增
        tabcmd.cmds.forEach((item, index) => {
          if (item === 'actionADD') {
            if (tabcmd.prem[index]) {
              const type = item.split('action');
              const str = `CMD_${type[1].toUpperCase()}`;
              const buttonConfigInfo = this.buttonMap[str];
              this.buttonMap[str].eName = 'actionMODIFY';
              this.buttonMap[str].name = '保存';
              buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
              this.buttonMap[str].editTheNewId = '-1';// 编辑新增标识
              this.dataArray.refresh = false;
              this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
              this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
            }
          }
        });
        // const name = 'actionADD';
        // const type = name.split('action');
        // const str = `CMD_${type[1].toUpperCase()}`;
        // const buttonConfigInfo = this.buttonMap[str];

        // this.buttonMap[str].eName = name;
        // this.dataArray.refresh = false;
        // this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
        // this.buttonMap[str].editTheNewId = '-1';// 编辑新增标识

        // // buttonConfigInfo.requestUrlPath = this.tabcmd.paths[index];
        // this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
      },
      objectTryDelete(obj) { // 删除
        // debugger;
        if (this.hasTabPanels !== 0) { // 存在子表
          if (this.dynamicUrl) { // 有path
                
          } else { // 没有path
          }
        } else if (obj.requestUrlPath) { // 有path，没有子表
          console.log('有path', obj.requestUrlPath);
        
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行有path的删除?',
            confirm: () => {
              this.performMainTableDeleteAction({ path: obj.requestUrlPath, table: this.tableName, objId: this.itemId });
              this.$Message.success('删除成功');
              this.clickButtonsBack();
            }
          };
        } else {
          // 没有path
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行删除?',
            confirm: () => {
              this.performMainTableDeleteAction({ table: this.tableName, objId: this.itemId });
              this.$Message.success('删除成功');
              this.clickButtonsBack();
            }
          };
        }
      },
      // 

      objectAdd() { // 新增
        this.getObjectTabForMainTable({ table: this.tableName, objid: -1 });
        this.getObjectForMainTableForm({ table: this.tableName, objid: -1 });
        this.buttonShowType = 'add';
      },
      objectSave() { // 按钮保存操作
        switch (this.objectType) { // 判断是横向布局还是纵向布局
        case 'horizontal': // 横向布局
          this.horizontal();
          break;
        case 'vertical': // 纵向布局
          this.vertical();
          break;
        default:
          break;
        }
      },
      horizontal() {
        this.determineSaveType();
      }, // 横向布局，用来区分获取的参数
      vertical() {
        this.determineSaveType();
      }, // 纵向布局
      determineSaveType(obj) {
        this.getdynamicRequestUrl(this.dataArray.buttonGroupShowConfig.buttonGroupShow);
        this.saveParameters();// 调用获取参数方法
        if (this.itemId === '-1') { // 主表新增保存
          // console.log('主表新增保存');
          if (this.hasTabPanels === 0) { // 为0的情况下是没有子表
            // console.log('没有子表');
            if (this.dynamicUrl) { // 配置path
              console.log(' 主表新增保存,配置path的', this.dynamicUrl);
              // const objId = -1;
              const path = this.dynamicUrl;
              this.savaNewTable(path);
            } else { // 没有配置path
              const objId = -1;
              this.savaNewTable(objId);
            }
          }
          if (this.hasTabPanels > 0) { // 大于0 的情况下是存在子表
            // console.log('有子表');
            if (obj.requestUrlPath) { // 配置path
              // console.log('配置path的逻辑暂无添加');
            } else { // 没有配置path

            }
          }
        } else if (this.itemId !== '-1') { // 主表编辑保存
          if (this.dataArray.buttonGroupShowConfig.buttonGroupShow[0].editTheNewId === '-1') { // 编辑新增保存
            // console.log('编辑新增保存');
            if (this.hasTabPanels === 0) { // 为0的情况下是没有子表
              // console.log('没有子表', this.dynamicUrl);
              if (obj.requestUrlPath) { // 配置path
                console.log('编辑新增保存,配置path的逻辑');
                const path = this.dynamicUrl;
                this.savaNewTable(path);
              } else { // 没有配置path
                const objId = -1;
                this.savaNewTable(objId);
              }
            }
            if (this.hasTabPanels > 0) { // 大于0 的情况下是存在子表
              // console.log('有子表');
              if (obj.requestUrlPath) { // 配置path
                     
              } else { // 没有配置path
              
              }
            }
          } else {
            // console.log('主表编辑保存');
            if (this.hasTabPanels === 0) { // 为0的情况下是没有子表
              // console.log('没有子表', this.dynamicUrl);
              if (obj.requestUrlPath) { // 配置path
                console.log('主表编辑保存,配置path的逻辑');
                const path = this.dynamicUrl;
                this.savaNewTable(path);
              } else { // 没有配置path
                const objId = this.itemId;
                this.savaNewTable(objId);
              }
            }
            if (this.hasTabPanels > 0) { // 大于0 的情况下是存在子表
              // console.log('有子表');
              if (obj.requestUrlPath) { // 配置path
                // console.log('配置path的逻辑暂无添加');
              } else { // 没有配置path

              }
            }
          }
        } 
      },
      savaNewTable(path, objId) { // 主表新增保存方法
        const tableName = this.tableName;
        const parame = {
          ...this.currentParameter,
          tableName,
          objId,
          path
        };
        this.performMainTableSaveAction(parame);
        // if (this.info) {
        // clearTimeout(window.timer);
        if (this.objectType === 'horizontal') { // 横向布局
          if (this.newMainTableSaveData.code === 0) {
            // console.log('暂无添加横向布局有path的逻辑');// 有path
            // const itemId = this.mainFormInfo.buttonsData.newMainTableSaveData.objId;// 保存接口返回的明细id
            // this.getObjectTabForMainTable({ table: tableName, objid: itemId });
            // this.getObjectForMainTableForm({ table: tableName, objid: itemId });
          }
        } else {
          setTimeout(() => {
            if (this.mainFormInfo.buttonsData.newMainTableSaveData.code === 0) {
              const itemId = this.mainFormInfo.buttonsData.newMainTableSaveData.objId;// 保存接口返回的明细id
              this.getObjectTabForMainTable({ table: tableName, objid: itemId });
              this.getObjectForMainTableForm({ table: tableName, objid: itemId });
            }
          }, 5000);
        }
      
     
        // }
      },
      saveParameters() {
        if (this.itemName) { // 有子表
          Object.keys(this.updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
            if (current === this.itemName) {
              this.currentParameter = this.updateData[current];
            }
            return obj;
          }, {});
        } else { // 没有子表
          Object.keys(this.updateData).reduce((obj, current) => { // 获取store储存的新增修改保存需要的参数信息
            if (current === this.tableName) {
              this.currentParameter = this.updateData[current];
            }
            return obj;
          }, {});
        }
      }
    },
    mounted() {
      this.getbuttonGroupData(this.tabcmd);
    },
    created() {
      const { tableName, tableId, itemId } = router.currentRoute.params;
      this.tableName = tableName;
      this.tableId = tableId;
      this.itemId = itemId;
      this.buttonMap = buttonmap;
    }
  };
</script>

<style lang="less">
.singleObjectButton {
  .buttonGroup {
    padding: 10px 20px 5px 20px;
  }
}
</style>
