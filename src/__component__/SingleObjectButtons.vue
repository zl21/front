<template>
  <div class="singleObjectButton">
    <ButtonGroup
      :data-array="dataArray"
      class="buttonGroup"
      @buttonClick="buttonClick"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';
  import moduleName from '../__utils__/getModuleName';
  import router from '../__config__/router.config';
  

  export default {
    data() {
      return {
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
        itemId: ''// 子表ID
      };
    },
    name: 'SingleObjectButtons',
    components: {
      ButtonGroup,
    },
    watch: {
      tabcmd: {
        handler(val) {
          this.dataArray.buttonGroupShowConfig.buttonGroupShow = [];
          this.getbuttonGroupData(val);
          this.getdynamicRequestUrl(val.paths);
         
          // 处理dynamicRequestUrl
        },
        deep: true
      },
    },
    computed: {
      ...mapState('global', ['keepAliveLists']),
     
      ...mapState(moduleName(), ['tabCurrentIndex'])
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

    },
    methods: {
      getdynamicRequestUrl(paths) { // 获取接口返回路径
        paths.forEach((d, i) => {
          this.dynamicRequestUrl[d] = paths[i];
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
          this.objectSave();
          break;
        case 'actionEXPORT': // 导出
          this.objectEXPORT();
          break;
        case 'actionGROUPSUBMIT': // 批量提交
          this.objectGROUPSUBMIT();
          break;
        case 'actionDELETE': // 删除
          this.objectTryDelete();
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
                // buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
                this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
              }
            }
          });
        }
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
        console.log('🐘', this.tabCurrentIndex);
      },
      vertical() {
      },
     
    },
    mounted() {
      this.getbuttonGroupData(this.tabcmd);
      console.log('🐘', this.tabCurrentIndex);
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
