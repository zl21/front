<template>
  <div class="InstanceManagementList">
    <div class="content">
      <Tabs
        :value="tabalive"
        @on-click="onClick"
      >
        <TabPane
          label="待我审批的"
          name="待我审批的"
        >
          <todoProcess
            ref="todo"
            :tabalive="tabalive"
          />
        </TabPane>
        <TabPane
          label="我已审批的"
          name="我已审批的"
        >
          <HistoricalProcess
            ref="history"
            :tabalive="tabalive"
          />
        </TabPane>
        <TabPane
          label="我发起的"
          name="我发起的"
        >
          <launchList
            ref="launch"
            :tabalive="tabalive"
          />
        </TabPane>
        <TabPane
          label="抄送人"
          name="抄送人"
        >
          <CopyPersonList :tabalive="tabalive" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
 <script>
  import todoProcess from './TodoProcess';
  import HistoricalProcess from './HistoricalProcess';
  import launchList from './launchList';
  import CopyPersonList from './CopyPersonList';

  export default {
    name: 'InstanceManagementList',
    components: {
      todoProcess, HistoricalProcess, launchList, CopyPersonList 
    },
    data() {
      return {
        tabalive: '待我审批的', // tab切换默认值
        tabConfig: [
          {
            label: '待我审批的',
            name: '待我审批的'
          },
          {
            label: ' 我已审批的',
            name: ' 我已审批的'
          },
          {
            label: '我发起的',
            name: '我发起的'
          }, 
          {
            label: '抄送我的',
            name: '抄送我的'
          }
        ]
      };
    },
    methods: {
      routeClick(val) {
        if (val === 1) {
          this.tabalive = '待我审批的';
        } else if (val === 2) {
          this.tabalive = ' 我已审批的';
        } else if (val === 3) {
          this.tabalive = ' 我发起的';
        } else if (val === 4) {
          this.tabalive = ' 抄送我的';
        }
      },
      // tab切换点击事件
      onClick(val) {
        this.tabalive = val;
      // if(val==='历史流程'){
      //  window.history.replaceState({}, '', "/InstanceManagementList?type=2");
      // }else{
      //  window.history.replaceState({}, '', "/InstanceManagementList?type=1");
      // }
      }
    },
    created() {
      const path = window.location.pathname;
      this.routeClick(path.split('=')[1]);
    },
    mounted() {
      this.showTab = window.jflowPlugin.showTab;
    },
    activated() {
      if (this.tabalive === '待我审批的') {
        this.$refs.todo.getselectOption();
        this.$refs.todo.queryLists();
        this.$refs.todo.getAgent();
      }
      if (this.tabalive === ' 我已审批的') {
        this.$refs.history.getselectOption();
        this.$refs.history.queryLists();
      }
      if (this.tabalive === ' 我发起的') {
        this.$refs.launch.getselectOption();
        this.$refs.launch.queryLists();
      }
      if (this.tabalive === '抄送人') {
        this.$refs.copy.getselectOption();
        this.$refs.copy.queryLists();
      }
    }
  };
</script>
<style lang="less" >
.InstanceManagementList {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  z-index: 2000;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    display: flex;
    background: white;
    padding: 10px;
    position: relative;

    .InstanceManagementListDelete {
      width: 12px;
      position: absolute;
      top: 0;
      right: 0;
      top: 12px;
      right: 14px;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .burgeon-breadcrumb {
    font-size: 18px;
    margin-bottom: 12px;
  }
  .burgeon-tabs {
    flex: 1;
    display: flex;
    -webkit-box-direction: column;
    flex-direction: column;
    background: white;
    .burgeon-tabs-bar {
      height: 27px;
    }
    .burgeon-tabs-content-animated {
      flex: 1;
      .burgeon-tabs-tabpane {
        display: flex;
      }
    }
  }
}
</style>
