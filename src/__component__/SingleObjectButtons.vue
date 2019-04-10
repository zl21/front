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
      }
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
     
      // buttonsData(tabcmd) {
      //   const cmds = tabcmd.cmds;
      //   const prem = tabcmd.prem;
      //   const newcmds = [];
      //   const newprem = [];
      //   const newtabs = {};
      //   for (let i = 0; i < cmds.length; i++) {
      //     const cmd = cmds[i];
      //     newcmds.push(cmd);
      //   }
      //   for (let i = 0; i < prem.length; i++) {
      //     const pre = prem[i];
      //     newprem.push(pre);
      //   }
      //   for (let j = 0; j < newcmds.length; j++) {
      //     const element = newcmds[j];
      //     if (element === 'actionPRINT' && newprem[j]) {
      //       this.dataArray.printValue = true;
      //     } else {
      //       newtabs[element] = newprem[j];
      //       // console.log('🥤', newprem);
      //     }
      //   }
      //   console.log('🐟', newtabs);

      //   return newtabs;
      //   // newcmds = cmds.reduce((arr, item) => { 
      //   //   arr.push(item);
      //   //   return arr;
      //   // }, []);
      //   // newprem = prem.reduce((arr, item) => { 
      //   //   arr.push(item);
      //   //   return arr;
      //   // }, []);
      //   // newcmds = newcmds.forEach((item, index) => {
      //   //   const element = newcmds[index];
      //   //   if (element === 'actionPRINT' && newprem[index]) {
      //   //     this.dataArray.printValue = true;
      //   //   } else {
      //   //     newtabs[element] = newprem[index];
      //   //   }
      //   // });
      //   // return newtabs;

      //   // console.log(567, newtabs);
     
      //   // for (let j = 0; j < newcmds.length; j++) {
      //   //   const element = newcmds[j];
      //   //   if (element === 'actionPRINT' && newprem[j]) {
      //   //     this.printValue = true;
      //   //   } else {
      //   //     newtabs[element] = newprem[j];
      //   //   }
      //   // }
      //   // console.log(777, newtabs);
      //   // return newtabs;
      // },
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
                console.log('🍓', this.dataArray.buttonGroupShowConfig.buttonGroupShow);
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
