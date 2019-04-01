<template>
  <div>
    <ButtonGroup
      :data-array="buttons.dataArray"
      @buttonClick="buttonClick"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataArray: {
          printValue: false,
          actionCollection: false,
          collectiImg: false, // 是否收藏
          waListButtonsConfig: {// 自定义按钮
            waListButtons: [
              {
            
              },
          
            ]
          },
          buttonGroupShowConfig: {// 标准按钮
            buttonGroupShow: this.getTabName()
          },
          btnclick: (type, item) => {
            const self = this;
            return self.buttonClick(type, item);
          }
        },
      };
    },
    name: 'SingleObjectButtons',
    components: {},
    watch: {},
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
       
      buttonsData() {
        const cmds = this.tabcmd.cmds;
        const prem = this.tabcmd.prem;
        const newcmds = [];
        const newprem = [];
        const newtabs = {};
        for (let i = 0; i < cmds.length; i++) {
          const cmd = cmds[i];
          newcmds.push(cmd);
        }
        for (let i = 0; i < prem.length; i++) {
          const pre = prem[i];
          newprem.push(pre);
        }
        for (let j = 0; j < newcmds.length; j++) {
          const element = newcmds[j];
          if (element === 'actionPRINT' && newprem[j]) {
            this.printValue = true;
          } else {
            newtabs[element] = newprem[j];
          }
        }
        return newtabs;
      },
      getTabName() {
        const buttonsData = this.buttonsData();
        const buttonsDataValue = [];
        Object.keys(buttonsData).map((item) => { // 转换按钮数据格式
          const buttonValue = item.split('action').join('CMD_'); 
          console.log(666, this.buttonmap[buttonValue].name);

          return buttonsDataValue.push(this.buttonmap[buttonValue].name);
        });
      },
    },
    mounted() {
      this.buttonsData();
    }
  };
</script>

<style lang="less">
</style>
