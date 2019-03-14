<template>
  <div class="buttonList">
    <div class="button-group">
      <!-- //查找 -->
      <Button
        type="warning"
        class="searchButton"
        @click="searchData('search')"
        v-text="search"
      />
      <Button
        v-for="(item, index) in dataArray.buttonGroupShow"
        :key="index"
        type="warning"
        ghost
        @click="AddDetails(item)"
        v-text="item.name"
      />
      <Button
        v-for="(item, index) in dataArray.waListButtons"
        :key="item.webid"
        type="warning"
        ghost
        @click="webaction(item)"
        v-text="item.webdesc"
      />
      <Dropdown
        v-if="dataArray.printValue"
        trigger="click"
        placement="bottom-start"
        split-button
        type="primary"
        @click="webaction(printList[0])"
      >
        <Button type="warning">
          打印
          <Icon type="ios-arrow-down" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item, index) of printList"
            v-if="index !== 0"
            :key="item.webid"
          >
            {{ item.webdesc }}
          </DropdownItem>
          <DropdownItem>
            <a
              href="http://up.ffvos.cn/FinePrint.exe"
              target="_blank"
            >打印插件</a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button
        v-if="dataArray.actionCollection"
        type="warning"
        ghost
        @click="collectTablelist"
      >
        <span>
          <i
            v-if="!dataArray.collectiImg"
            class="iconfont"
          >&#xe62e;</i>
          <i
            v-else
            class="iconfont"
          >&#xe62b;</i>
        </span>
      </Button>
    </div>
  </div>
</template>
<script>
  // import buttonmap from '../assets/js/buttonmap';
  // import ChineseDictionary from '../assets/js/ChineseDictionary';

  export default {
    name: 'ButtonList',
    props: {
      dataArray: {
        type: Object,
        default: () => ({})
      }

    },
    components: {
    },
    mounted() {
    },
    data() {
      return {
        search: '查找',
        errorDialog: false, // 消息弹框
        // buttonMap: "", // 按钮字典
        // ChineseDictionary: '', // 中英文转换
        // buttonMap: '', // 按钮字典
        dialogVisible: false, // 消息提示框
        dialogMessage: '', // 消息提示框显示数据
        importData: { // 导出提示
          importDialog: false,
          importDialogTitle: '',
          mainTable: this.$route.query.tableName,
          mainId: this.$route.query.id,
        },
        dataConShow: {
          dataConShow: false,
          title: '',
          tabConfig: {},
          fixedcolumns: {},
          reffixedcolumns: {},
        },
        objTableUrl: '', // 判断双击跳转是否是单对象
        errorData: [], // 弹框内容
        printList: [// 打印列表
          {
            vuedisplay: 'dialog',
            confirm: '{"isselect":true,"nodesc":"请先选择需要打印的记录！"}',
            actiontype: 'url',
            isrefrsh: false,
            webid: 2527,
            webdesc: '打印rrr',
            webname: 'OutPrint',
            webicon: null,
            action: 'custompage/redirect?print',
            cuscomponent: null,
            ishide: false
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
            cuscomponent: null,
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
            cuscomponent: null,
            ishide: false
          }
        ] // 打印选择列表
      };
    },
    methods: {
      
      AddDetails(obj) {
        console.log(1);
      },
      collectTablelist() {
        console.log(1);
      },
      closeDialog() {
        console.log(1);
      },
      buttonConfirm() {
        console.log(1);
      }
    },
    created() {
      // const _self = this;
      // _self.buttonMap = buttonmap;
      // _self.ChineseDictionary = ChineseDictionary;
    },
  };
</script>

<style lang="less">
.buttonList {
  padding: 17px;
  > div {
    display: inline-block;
  }

  p {
    line-height: 24px;
    color: #0f8ee9;
    display: inline-block;

    &:hover {
      cursor: pointer;
    }
  }
  .button-group {
    display: flex;
    justify-content: flex-start;
    text-align: right;
    font-size: 0;
    overflow: hidden;
     flex-wrap: wrap ;
     .burgeon-select-dropdown{
      top: 131px !important;
       .burgeon-dropdown-menu{
         min-width: 58px;
         .burgeon-dropdown-item{
           padding: 5px 6px;
         }
         .burgeon-dropdown-item:hover {
            background-color: #ecf5ff;
            color: #66b1ff;
        }
       }
     }
    .ff--el-dropdown {
      float: left;
    }
    button {
      height: 24px;
      line-height: 18px;
      width: auto;
      margin-right: 8px;
      margin-left: 0px;
      padding: 0 8px;
      background: #fff;
      color: #fd6442;
      border: 1px solid #fd6442;
      border-radius: 2px;
      font-size: 12px;
      margin-bottom: 4px;
    }

    button:not(.searchButton) {
      &:hover {
        border-color: rgba(253, 100, 66, 0.6);
        color: rgba(253, 100, 66, 0.6);
      }
    }
    button.searchButton {
      background-color: #fd6442;
      border: 1px solid #fd6442;
      color: white;
      &:hover {
        background-color: #e6502f;
        color: #f3cec5;
        border: 1px solid #e6502f;
      }
    }

    > button:last-child {
      margin-right: 0px;
    }

    .hiddenDropdown {
      font-size: 12px;
      height: 24px;
      box-sizing: border-box;
      button {
        margin-top: -1px;
      }
    }
  }
}
</style>
