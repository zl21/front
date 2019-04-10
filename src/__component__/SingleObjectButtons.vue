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
      buttonClick(type, obj, index) {
        if (type === 'fix') {
          this.objectTabAction(obj, index);
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
      objectTabAction(obj, index) {
        // clearTimeout(window.timer);

        // window.timer = setTimeout(() => {
        switch (index) {
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
        
      },
      objectAdd() { // 新增
        const self = this;
        self.pageIsNew = true;
        this.getObjectTab();
        self.storageItem.id = '-1';
        axios({
          method: 'post',
          url: '/p/cs/getObject',
          data: {
            table: self.$route.query.tableName,
            objid: -1,
          },
        })
          .then((res) => {
            self.objViewConfig.configrow = res.data.data.objviewcol;
            const list = self.reNullConfigList(res.data.data.addcolums);
            res.data.data.addcolums.forEach((item, index) => {
              if (item.childs) {
                item.childs.forEach((temp) => {
                  self.defaultConfig.push(self.reaptData(temp));
                });
              } else {
                self.defaultConfig.push(self.reaptData(item.child));
              }
            });
            setTimeout(() => {
              self.configList = list;
            }, 100);
            $('.item-obj .input-wrap input').eq(0).focus(); // 第一个输入框获取焦点
          })
          .catch((err) => {
          });
      },
      getbuttonGroupData(tabcmd) {
        const tabcmdData = tabcmd;
        if (tabcmdData.cmds) {
          // const buttonGroupShow = [];
          tabcmdData.cmds.forEach((item, index) => {
            if (tabcmdData.prem[index]) {
              const type = item.split('action');
              const str = `CMD_${type[1].toUpperCase()}`;
              if (str === 'CMD_PRINT') {
                this.dataArray.printValue = true;
              } else {
                const buttonConfigInfo = this.buttonMap[str];
                // buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
                this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(buttonConfigInfo);
              }
            }
          });
        }
      }
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
