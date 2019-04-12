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
  import buttonmap from '../assets/js/buttonmap';
  import ButtonGroup from './ButtonComponent';


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
    computed: {},
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
                buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
                this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
              }
            }
          });
        }
      },
      // 删除
      objectTryDelete() {

        // const primaryTableParams = {};
        // primaryTableParams[this.storageItem.name || this.$route.query.tableName] = {
        //   ID: this.storageItem.id || this.$route.query.id,
        //   isdelmtable: true,
        // };
        // axios({
        //   url: this.dynamicRequestUrl.actionDELETE || '/p/cs/objectDelete',
        //   method: 'POST',
        //   contentType: 'application/json',
        //   // data: {
        //   //   table: this.storageItem.name || this.$route.query.tableName,
        //   //   objid: this.storageItem.id || this.$route.query.id,
        //   //   isdelmtable: true,
        //   // },
        //   data: this.dynamicRequestUrl.actionDELETE ? (this.reftabs.length === 0 ? {
        //     ID: this.storageItem.id || this.$route.query.id,
        //     isdelmtable: true
        //   } : primaryTableParams) : {
        //     table: this.storageItem.name || this.$route.query.tableName,
        //     objId: this.storageItem.id || this.$route.query.id,
        //     delMTable: true,
        //   }
        // })
        //   .then((res) => {
        //     if (res.data.code == 0) {
        //       this.$message({
        //         message: res.data.message,
        //         type: 'success',
        //         duration: 1500,
        //       });
        //       this.objectAddReturn();
        //     }
        //   });
      },
    },
    mounted() {
      this.getbuttonGroupData(this.tabcmd);
    },
    created() {
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
