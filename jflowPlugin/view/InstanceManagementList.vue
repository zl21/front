<template>
  <div class="InstanceManagementList">
    <div class="content">
      <Tabs
        :value="tabalive"
        @on-click="onClick"
      >
        <TabPane
          v-for="(item,index) in tabConfig"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <keep-alive>
            <components
              :is="currentComponents"
              v-if="currentComponents === item.name"
              :ref="item.name"
              :tabalive="tabalive"
            />
          </keep-alive>
        </TabPane>
        <!-- <TabPane
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
          <todoProcess
            ref="history"
            :tabalive="tabalive"
          />
        </TabPane>
        <TabPane
          label="我发起的"
          name="我发起的"
        >
          <todoProcess
            ref="launch"
            :tabalive="tabalive"
          />
        </TabPane>
        <TabPane
          label="抄送我的"
          name="抄送我的"
        >
          <todoProcess :tabalive="tabalive" />
        </TabPane> -->
      </Tabs>
    </div>
  </div>
</template>
 <script>
  import Vue from 'vue';
  import todoProcess from './TodoProcess';

  export default {
    name: 'InstanceManagementList',
    components: {
      todoProcess
    },
    data() {
      return {
        tabalive: 'todoList', // tab切换默认值
        tabConfig: [
          {
            label: '待我审批的',
            name: 'todoList'
          },
          {
            label: ' 我已审批的',
            name: 'approvalList'
          },
          {
            label: '我发起的',
            name: 'launchList'
          }, 
          {
            label: '抄送我的',
            name: 'copyList'
          }
        ],

        currentComponents: null // 当前组件
      };
    },
    methods: {
      // tab切换点击事件
      onClick(val) {
        this.tabalive = val;
        if (!Vue.component(this.tabalive)) {
          Vue.component(this.tabalive, Vue.extend(todoProcess));
        } 
        this.currentComponents = this.tabalive;
      }
    },
    created() {
      if (!Vue.component(this.tabalive)) {
        Vue.component(this.tabalive, Vue.extend(todoProcess));
      } 
      this.currentComponents = this.tabalive;
    },
    activated() {
      // if (this.tabalive === '待我审批的') {
      //   this.$refs.todo.getselectOption();
      //   this.$refs.todo.queryLists();
      //   this.$refs.todo.getAgent();
      // }
      // if (this.tabalive === ' 我已审批的') {
      //   this.$refs.history.getselectOption();
      //   this.$refs.history.queryLists();
      // }
      // if (this.tabalive === ' 我发起的') {
      //   this.$refs.launch.getselectOption();
      //   this.$refs.launch.queryLists();
      // }
      // if (this.tabalive === '抄送人') {
      //   this.$refs.copy.getselectOption();
      //   this.$refs.copy.queryLists();
      // }
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
  overflow: hidden;

  .content {
    height: 100%;
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

  .ark-breadcrumb {
    font-size: 18px;
    margin-bottom: 12px;
  }
  .ark-tabs {
    flex: 1;
    display: flex;
    -webkit-box-direction: column;
    flex-direction: column;
    background: white;
    .ark-tabs-bar {
      height: 27px;
    }
    .ark-tabs-content-animated {
      height: calc(~"100% - 43px");
      flex: 1;
      .ark-tabs-tabpane {
        display: flex;
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
