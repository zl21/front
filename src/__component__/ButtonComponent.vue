<template>
  <div class="buttonList">
    <div class="button-group">
      <!-- //查找 -->
      <Button
        v-if="dataArray.search"
        type="posdefault"
        @click="btnclick('search')"
        v-text="search"
      />
      <Button
        v-for="(item, index) in dataArray.buttonGroupShowConfig.buttonGroupShow"
        :key="index"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick('fix', item,index)"
        v-text="item.name" 
      />
      <Button
        v-for="(item) in dataArray.waListButtonsConfig.waListButtons"
        :key="item.webid"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick('custom', item)"
        v-text="item.webdesc" 
      />
      <Button
        v-for="(item,index) in dataArray.jflowPluginDataArray"
        :key="index"
        :ref="item"
        type="fcdefault"
        @click="btnclick('extraposition', item)"
        v-text="item.name" 
      />
      <Dropdown
        v-if="dataArray.printValue"
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
        v-if="dataArray.refresh"
        type="fcdefault"
        @click="btnclick('refresh')"
        v-text="refresh"
      />
      <Button
        v-if="dataArray.back"
        type="fcdefault"
        @click="btnclick('back')"
        v-text="back"
      />
      <Dialog
        ref="dialogRef"
        :title="dialogConfig.title"
        :mask="dialogConfig.mask"
        :content-text="dialogConfig.contentText"
        :footer-hide="dialogConfig.footerHide"
        :confirm="dialogConfig.confirm"
        :dialog-component-name="dialogComponentName"
        @clearDialogComponentName="clearDialogComponentName"
        @dialogComponentSaveSuccess="dialogComponentSaveSuccess"
      />
    </div>
  </div>
</template>
<script> 
  
  import Dialog from './Dialog.vue';

  export default {
    name: 'ButtonList',
    props: {
      dataArray: {
        type: Object,
        default: () => ({})
      },
     
    },
    components: {
      Dialog
    },
  
    mounted() {
     
    },
    data() {
      return {
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
    methods: {
      dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作
        setTimeout(() => {
          this.print(2530);
        }, 1000);
      },
      clearDialogComponentName() {
        this.dialogComponentName = null;
      },
      print(id) {
        let tab = {};
        this.printList.forEach((item) => {
          if (item.webid === id) {
            tab = item;
          }
        });
        this.objTabActionDialog(tab);
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
   
  };
</script>

<style lang="less">
.buttonList {
  padding: 8px 0px;
  > div {
    display: inline-block;
  }
  }
  .button-group {
    display: flex;
    justify-content: flex-start;
    text-align: right;
    overflow: hidden;
    flex-wrap: wrap;
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
