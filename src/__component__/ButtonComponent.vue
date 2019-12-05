<template>
  <div class="R3-buttonList">
    <div class="R3-button-group">
      <!-- //查找 -->
      <Button
        v-if="dataArray.search"
        type="posdefault"
        @click="btnclick('search')"
        v-text="search"
      />
      <Button
        v-for="(item, index) in dataArray.buttonGroupShowConfig.buttonGroupShow"
        :id="item.eName"
        :key="item.eName"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick('fix', item,index)"
        v-text="item.name" 
      />
      <Button
        v-for="(item) in dataArray.waListButtonsConfig.waListButtons"
        :id="item.eName"
        :key="item.webid"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick('custom', item)"
        v-text="item.webdesc" 
      />
      <!-- <Button
        type="fcdefault"
        @click="btnclick('custom', a)"
        v-text="a.webdesc" 
      /> -->
      <Button
        v-for="(item) in dataArray.jflowPluginDataArray"
        :key="item.button"
        :ref="item"
        type="fcdefault"
        @click="btnclick('extraposition', item)"
        v-text="item.name" 
      />
      <Dropdown
        v-if="dataArray.printValue"
        id="print"
        trigger="click"
        placement="bottom-start"
        split-button
        type="primary"
        @on-click="print"
      >
        <Button type="fcdefault">
          打印
          <Icon type="ios-arrow-down" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item) of printList"
            :key="item.webid"
            :name="item.webid"
          >
            {{ item.webdesc }}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button
        v-if="dataArray.actionCollection"
        type="fcdefault"
        class="collection"
        @click="btnclick('Collection')"
      >
        <span>
          <i
            v-if="!dataArray.collectiImg"
            class="iconfont iconbj_col"
          />
          <i
            v-else
            class="iconfont iconbj_alrcol"
          />
        </span>
      </Button>
      <Button
        v-show="dataArray.refresh"
        id="refresh"
        type="fcdefault"
        @click="btnclick('refresh')"
        v-text="refresh"
      />
      <Button
        id="hideRefresh"
        class="hide"
        type="fcdefault"
        @click="btnclick('refresh')"
        v-text="refresh"
      />
      <Button
        v-if="dataArray.back"
        id="back"
        type="fcdefault"
        @click="btnclick('back')"
        v-text="back"
      />
      <Dialog
        ref="dialogRef"
        :id-array="idArray"
        :title="dialogConfig.title"
        :mask="dialogConfig.mask"
        :content-text="dialogConfig.contentText"
        :footer-hide="dialogConfig.footerHide"
        :confirm="dialogConfig.confirm"
        :item-id="itemId"
        :closable="true"
        :dialog-component-name="dialogComponentName"
        @clearDialogComponentName="clearDialogComponentName"
        @clearSelectIdArray="clearSelectIdArray"
      />
    </div>
  </div>
</template>
<script> 
  
  import { mapState } from 'vuex';
  import Dialog from './Dialog.vue';
  import network from '../__utils__/network';
  import { MODULE_COMPONENT_NAME } from '../constants/global';

  export default {
    name: 'ButtonList',
    inject: [MODULE_COMPONENT_NAME],
    props: {
      dataArray: {
        type: Object,
        default: () => ({})
      },
      idArray: {
        type: [Array, Object],
        default: () => ({})
      },
      itemId: {// 获取当前子表明细ID
        type: String,
        default: () => ''
      },
    },
    components: {
      Dialog
    },
  
    mounted() {
      window.addEventListener('childTableSaveFile', () => {
        if (!this._inactive) {
          const dom = document.getElementById('actionMODIFY');
          dom.click();
        }
      }, false);
    },
    data() {
      return {
        // a: {
        //   action: 'com.jackrain.nea.oc.oms.api.OcbOrderMergeMenuCmd:1.0:oms-fi',
        //   actiontype: 'rpc',
        //   ishide: false,
        //   isrefrsh: false,
        //   vuedisplay: 'slient',
        //   webdesc: '财务审核',
        //   webid: 3146003333,
        //   webname: 'V_CUST_OPEN_FINANCE_EXAMINE',
        // },
        dialogComponentName: null,
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
        search: '查找',
        refresh: '刷新',
        back: '返回',
        errorDialog: false, // 消息弹框
        dialogVisible: false, // 消息提示框
        dialogMessage: '', // 消息提示框显示数据
        dataConShow: {
          dataConShow: false,
          title: '',
          tabConfig: {},
          fixedcolumns: {},
          reffixedcolumns: {}
        },
        objTableUrl: '', // 判断双击跳转是否是单对象
        errorData: [], // 弹框内容
        printList: [
          // 打印列表
          {
            vuedisplay: 'dialog',
            /* "confirm":"{\"isselect\":true,\"nodesc\":\"请先选择需要打印的记录！\"}", */
            actiontype: 'url',
            isrefrsh: false,
            webid: 2527,
            webdesc: '直接打印',
            webname: 'OutPrint',
            webicon: null,
            action: 'custompage/redirect?print',
            cuscomponent: null,
            ishide: false,
          },
          {
            vuedisplay: 'dialog',
            confirm: '{"isselect":true,"nodesc":"请先选择需要打印预览的记录！"}',
            actiontype: 'url',
            isrefrsh: false,
            webid: 2530,
            webdesc: '打印预览',
            webname: 'OutPreview',
            webicon: null,
            action: 'custompage/redirect?preview',
            cuscomponent: 'printPreview',
            ishide: false
          },
          {
            vuedisplay: 'dialog',
            confirm: null,
            actiontype: 'url',
            isrefrsh: false,
            webid: 2533,
            webdesc: '设置模板',
            webname: 'OutSetTemplate',
            webicon: null,
            action: 'custompage/Konad',
            cuscomponent: 'printTemplate',
            ishide: false
          }
        ], // 打印选择列表
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
      };
    },
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      }),
     
    },
    methods: {
      // dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作  暂时不需要保存并打印
      //   setTimeout(() => {
      //     this.print(2530);
      //   }, 1000);
      // },
      clearSelectIdArray() { // 用于关闭打印相关弹框清空标准列表界面选中项
        this.$emit('clearSelectIdArray'); 
      },
      clearDialogComponentName() {
        this.dialogComponentName = null;
        //  this.$emit('buttonClick', type, item);
      },
      print(id) {
        const iFrame = document.getElementById('iframe');
        if (iFrame) {
          document.body.removeChild(iFrame);
        }
        let tab = {};
        let printContent = {};
        this.printList.forEach((item) => {
          if (item.webid === id) {
            tab = item;
          } else if (item.webid === 2530) {
            printContent = item;
          }
        });
        let printIdArray = [] || '';
        if (this[MODULE_COMPONENT_NAME][0] === 'S') { // 只有列表界面需要勾选明细
          printIdArray = this.idArray;
          if (printIdArray.length === 0 && id === 2530) { // 没有勾选且为打印预览
            const data = {
              mask: true,
              title: '警告',
              content: '请先选择需要打印预览的记录！'
            };
            this.$Modal.fcWarning(data);
            return;
          } if (printIdArray.length === 0 && id === 2527) { // 直接打印
            const data = {
              mask: true,
              title: '警告',
              content: '请先选择需要直接打印的记录！'
            };
            this.$Modal.fcWarning(data);
            return;
          }
        } else {
          const { itemId } = this.$route.params;
          printIdArray = itemId;
        }
        if (id === 2527 || id === 2530) { // 直接打印
          let src = '';
          this.$loading.show();

          network.get(`/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${printIdArray}&userId=${this.userInfo.id}`).then((res) => {
            if (res.status === 200) {
              if (this[MODULE_COMPONENT_NAME][0] === 'S') {
                if (id === 2530) {
                  this.$loading.hide();
                  this.objTabActionDialog(tab);
                } else { 
                  src = `/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${this.idArray}&userId=${this.userInfo.id}`;
                  this.setIframeForPrint(src);
                }
              } else {
                const printId = this.itemId;
                if (id === 2530) {
                  this.$loading.hide();
                  this.objTabActionDialog(tab);
                } else {
                  src = `/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${printId}&userId=${this.userInfo.id}`;
                  this.setIframeForPrint(src);
                }
              }
            } else {
              this.$loading.hide();
            }
          }).catch(() => {
            this.$loading.hide();
          });
        } else {
          this.objTabActionDialog(tab);
        }
      },
      setIframeForPrint(printSrc) {
        const getElement = document.getElementById('iFrame');
        if (getElement) {
          document.body.removeChild(getElement);
        }
        const iFrame = document.createElement('iframe');
        iFrame.src = printSrc;
        iFrame.id = 'iFrame';
        iFrame.style.display = 'none';
        document.body.appendChild(iFrame);
        document.getElementById('iFrame').focus();
        document.getElementById('iFrame').contentWindow.print();
        this.clearSelectIdArray();
        const dom = document.getElementById('iFrame');
        if (dom.attachEvent) {  
          dom.attachEvent('onload', () => { // IE  
            this.$loading.hide();
          });  
        } else {  
          dom.onload = () => { // 非IE  
            this.$loading.hide();
          };  
        }
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        this.$refs.dialogRef.open();
        const title = tab.webdesc;
        this.dialogConfig = {
          title,
        };
        this.dialogConfig.footerHide = true;
        // Vue.component(filePath, CustomizeModule[filePath].component);
        this.dialogComponentName = tab.cuscomponent;

        // }
      },
      btnclick(type, item) {
        this.$emit('buttonClick', type, item);
      },
        
    },
    created() {
      // this[MODULE_COMPONENT_NAME] = getComponentName();
    },
   
  };
</script>

<style lang="less" scope>
.R3-buttonList {
  padding: 8px 0px;
  
  > div {
    display: inline-block;
  }
  }
  .R3-button-group {
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    flex-wrap: wrap;
    .hide{
      display:none;
    }
    .burgeon-select-dropdown {
      .burgeon-dropdown-menu {
        min-width: 58px;
        .burgeon-dropdown-item {
          padding: 5px 6px;
        }
      }
    }
    .ff--el-dropdown {
      float: left;
    }
    button {
      height: 22px;
      line-height: 18px;
      margin-right: 8px;
      margin-left: 0px;
      padding: 0 8px;
      margin-bottom: 4px;
    }
    > button:last-child {
      margin-right: 0px;
    }
    .hiddenDropdown {
      height: 24px;
      button {
        margin-top: -1px;
      }
    }
    .iconfont{
      font-size: 12px;
    }
    .collection,.burgeon-btn-fcdefault{
      min-width: auto !important;
    }
  }

</style>
