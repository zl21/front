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
      <Dropdown
        v-if="dataArray.printValue"
        trigger="click"
        placement="bottom-start"
        split-button
        type="primary"
        @click="webaction(printList[0])"
      >
        <Button type="fcdefault">
          打印
          <Icon type="ios-arrow-down" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item) of printList"
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
        type="fcdefault"
        @click="btnclick('Collection')"
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
  

  export default {
    name: 'ButtonList',
    props: {
      dataArray: {
        type: Object,
        default: () => ({})
      },
     
    },
    components: {},
  
    mounted() {
     
    },
    data() {
      return {
        search: '查找',
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
        ], // 打印选择列表
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
      };
    },
    methods: {
      btnclick(type, item) {
        this.$emit('buttonClick', type, item);
      },
    },
   
  };
</script>

<style lang="less">
.buttonList {
  padding: 17px;
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
      top: 131px !important;
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
      height: 24px;
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
  }

</style>
