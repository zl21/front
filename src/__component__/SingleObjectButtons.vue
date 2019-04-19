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
  import { mapActions, mapMutations, mapState } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';
  import moduleName from '../__utils__/getModuleName';
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
          refresh: false, // 显示刷新
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
        tableName: '', // 主表表名
        tableId: '', // 主表ID
        itemId: '', // 子表ID
        currentParameter: {},
        buttonShowType: '', // 判断按钮显示条件
        dynamic: {
          name: '保存',
          icon: '',
          defbutton: 'N',
          action: '',
        }// 保存url
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
          this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
          setTimeout(() => {
            if (Object.values(val).length > 0) {
              if (this.objectType === 'horizontal') { // 横向布局
                if (this.itemId === 'New') { // 编辑按钮渲染逻辑
                  this.addButtonShow(val);
                } else { // 新增按钮渲染逻辑
                  this.getbuttonGroupData(val);
                }
              } else if (this.objectType === 'vertical') {
                // if (this.buttonShowType === 'add') { // 编辑新增按钮渲染逻辑
                //   this.addButtonShow(val);
                // } else //暂未处理带子表的逻辑
                if (this.itemId === 'New') { // 编辑按钮渲染逻辑
                  this.addButtonShow(val);
                } else { // 新增按钮渲染逻辑
                  this.getbuttonGroupData(val);
                }
              }
            }
          }, 500);
        },
        deep: true
      },
      tabwebact: {
        handler(val) {
          this.dataArray.waListButtonsConfig.waListButtons = [];
          if (this.objectType === 'horizontal') { // 横向布局
            if (this.itemId === 'New') { // 新增按钮渲染逻辑 
            } else { // 编辑按钮渲染逻辑
              this.waListButtons(val);
            }
          } else if (this.objectType === 'vertical') {
            if (this.itemId === 'New') { // 编辑按钮渲染逻辑
            } else { // 新增按钮渲染逻辑
              this.waListButtons(val);
            }
          }
        },
        deep: true
      },
    },
    computed: {
      ...mapState('global', {
        activeTab: ({ activeTab }) => activeTab,
      }),
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
      itemNameGroup: {
        type: Array,
        default: () => ([])
      },
      hasTabPanels: {// 用来判断是否有子表
        type: Number,
        default: 0
      },
    },
    methods: {
      ...mapActions(moduleName(), ['getQueryListForAg']),
      ...mapMutations('global', ['tabHref']),
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
      },
      clickButtonsRefresh() {
        this.getObjectTabForMainTable({ table: this.tableName, objid: this.itemId });
        this.getObjectForMainTableForm({ table: this.tableName, objid: this.itemId });
        if (this.hasTabPanels !== 0) { // 有子表
          this.getInputForitemForChildTableForm({ table: this.itemName });
        }
        this.$Message.success('刷新成功');
      },
      objectTabAction(obj) {
        switch (obj.eName) {
        case 'actionADD': // 新增
          this.objectAdd(obj);
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
        // this.getObjectTabForMainTable({ table: tableName, objid: itemId });
        // this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      },
      getbuttonGroupData(tabcmd) {
        const tabcmdData = tabcmd;
        // if (this.itemId === '-1') { // 新增
        //   this.addButtonShow(tabcmd);
        // } else { // 双击
        if (tabcmdData.cmds) {
          tabcmdData.cmds.forEach((item, index) => {
            if (item !== 'actionEXPORT') {
              if (tabcmdData.prem[index]) {
                const type = item.split('action');
                const str = `CMD_${type[1].toUpperCase()}`;
                if (str === 'CMD_PRINT') {
                  this.dataArray.printValue = true;
                } else {
                  this.buttonMap[str].eName = item;
                  const buttonConfig = JSON.stringify(this.buttonMap[str]);// 因此操作会改变store状态值，所以对象字符串之间互转，生成新对象
                  const buttonConfigInfo = JSON.parse(buttonConfig);
                  buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
                  this.dataArray.refresh = true;
                  this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
                }
              }
            }
          });
        }
        // }
      },
      waListButtons(tabwebact) {
        tabwebact.objbutton.forEach((item) => {
          this.dataArray.waListButtonsConfig.waListButtons.push(item);
        });
      },
        
      addButtonShow(tabcmd) { // 判断按钮显示的条件是否为新增
        tabcmd.cmds.forEach((item, index) => {
          if (item === 'actionADD') {
            if (tabcmd.prem[index]) {
              if (item === 'actionADD') {
                this.dynamic.editTheNewId = '-1';// 编辑新增标识
                this.dynamic.eName = 'actionMODIFY';
                this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
                this.dynamic.requestUrlPath = this.tabcmd.paths[index];
                this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(this.dynamic);
              }
            }
          }
        });
      },
      objectTryDelete(obj) { // 删除
        const searchData = {
          table: this.tableName,
          startIndex: 0,
          range: 10
        };
        if (this.hasTabPanels !== 0) { // 存在子表
          if (this.dynamicUrl) { // 有path
                
          } else { // 没有path
          }
        } else if (obj.requestUrlPath) { // 有path，没有子表
          this.$refs.dialogRef.open();
          this.dialogConfig = {
            contentText: '确认执行有path的删除?',
            confirm: () => {
              this.performMainTableDeleteAction({ path: obj.requestUrlPath, table: this.tableName, objId: this.itemId });
              this.$Message.success('删除成功');
              this.clickButtonsBack();
              setTimeout(() => {
                this.getQueryListForAg(searchData);
              }, 1000);
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
              setTimeout(() => {
                this.getQueryListForAg(searchData);
              }, 1000);
            }
          };
        }
      },

      objectAdd() { // 新增
        const id = 'New';
        const label = `${this.activeTab.label.replace('编辑', '新增')}`;
        if (this.objectType === 'horizontal') {
          const type = 'tableDetailHorizontal';
          this.tabHref({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
        } else if (this.objectType === 'vertical') {
          const type = 'tableDetailVertical';
          this.tabHref({
            type,
            tableName: this.tableName,
            tableId: this.tableId,
            label,
            id
          });
        }
        this.getObjectTabForMainTable({ table: this.tableName, objid: 'New' });
        this.getObjectForMainTableForm({ table: this.tableName, objid: 'New' });
        this.buttonShowType = 'add';
      },
      objectSave(obj) { // 按钮保存操作
        switch (this.objectType) { // 判断是横向布局还是纵向布局
        case 'horizontal': // 横向布局
          this.horizontal(obj);
          break;
        case 'vertical': // 纵向布局
          this.vertical(obj);
          break;
        default:
          break;
        }
      },
      horizontal(obj) {
        this.determineSaveType(obj);
      }, // 横向布局，用来区分获取的参数
      vertical(obj) {
        this.determineSaveType(obj);
      }, // 纵向布局
      determineSaveType(obj) {
        console.log('🍇', this.hasTabPanels);// 不能拿这个判断是否存在子表，左右结构的时候是不对的，上下结构是对的
        // if (this.verifyRequiredInformation()) { // 验证表单必填项
        this.saveParameters();// 调用获取参数方法
        if (this.itemId === 'New') { // 主表新增保存和编辑新增保存
          // console.log('主表新增保存和编辑新增保存');
          const type = 'add';
          const path = this.dynamic.requestUrlPath;
          const objId = -1;
          
          if (this.hasTabPanels === 0) { // 为0的情况下是没有子表
            // console.log('没有子表');
            if (this.dynamic.requestUrlPath) { // 配置path
              // console.log(' 主表新增保存,配置path的', this.dynamic.requestUrlPath);
              this.savaNewTable(type, path, objId);
            } else { // 没有配置path
              this.savaNewTable(type, path, objId);
            }
          }
          if (this.hasTabPanels > 0) { // 大于0 的情况下是存在子表
            // console.log('有子表');
            const objectType = this.objectType; 
            if (this.objectType === 'horizontal') { // 判断是上下结构还是左右结构     //左右结构
              if (this.dynamic.requestUrlPath) { // 配置path
                const itemName = this.itemName;// 子表表名
                console.log('配置path', itemName);
               
                this.savaNewTable(type, path, objId, itemName, objectType);
              } else { // 没有配置path

              }
            } else if (this.objectType === 'vertical') { // 上下结构
              if (this.dynamic.requestUrlPath) { // 配置path
                console.log('配置path');
                const itemName = this.itemName;// 子表表名
                this.savaNewTable(type, path, objId, itemName, objectType);
              } else { // 没有配置path

              }
            }
          }
        } else if (this.itemId !== '-1') { // 主表编辑保存
          // console.log('主表编辑保存');
          if (this.hasTabPanels === 0) { // 为0的情况下是没有子表
            // console.log('没有子表',);
            const path = obj.requestUrlPath;
            const type = 'modify';
            if (obj.requestUrlPath) { // 配置path
              // console.log('主表编辑保存,配置path的逻辑', obj.requestUrlPath);
              this.savaNewTable(type, path, this.itemId);
            } else { // 没有配置path
              // console.log('主表编辑保存,没有配置path的逻辑');
              const objId = this.itemId;
              this.savaNewTable(type, path, objId);
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
        // }
      },
      verifyRequiredInformation() { // 验证表单必填项
        const checkedInfo = this.updateData[this.tableName].checkedInfo;
        const messageTip = checkedInfo.messageTip;
        if (messageTip.length > 0) {
          this.$Message.warning(messageTip[0]);
          checkedInfo.validateForm.focus();
          return false;
        }
        return true;
      },
      /**
       * 主表保存参数说明
       * {
       *    type: 保存类型：新增保存/编辑保存/编辑新增保存
       *    path:有新接口
       *    objId: 明细ID
       *    itemName: 子表表名
       *    objectType:判断是上下结构还是左右结构
       * }
       */
      savaNewTable(type, path, objId, itemName, objectType) { // 主表新增保存方法
        const tableName = this.tableName;
        const parame = {
          ...this.currentParameter,
          type,
          tableName,
          objId,
          path,
          itemName,
          objectType
        };
        this.performMainTableSaveAction(parame);
        setTimeout(() => {
          const itemId = this.mainFormInfo.buttonsData.newMainTableSaveData.objId;// 保存接口返回的明细id
          this.getObjectTabForMainTable({ table: tableName, objid: itemId });
          this.getObjectForMainTableForm({ table: tableName, objid: itemId });
        }, 3000);
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
