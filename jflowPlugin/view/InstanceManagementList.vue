<template>
  <div class="InstanceManagementList">
    <div class="content">
      <Tabs
        v-if="tabConfig.length > 0"
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
  import { global } from '../utils/global.config';

  export default {
    components: {
      todoProcess
    },
    data() {
      return {
        tabalive: null, // tab切换默认值
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
      },
      init() {
        this.tabConfig.map((item, index) => {
          if (!global.displayList.includes(String(index + 1))) {
            this.tabConfig.splice(index, 1);
          }
          return item;
        });
        let type = null;
        switch (global.displayList ? global.displayList.split(',')[0] : '1') {
        case '1': 
          type = 'todoList'; break;
        case '2': 
          type = 'approvalList'; break;
        case '3': 
          type = 'launchList'; break;
        case '4': 
          type = 'copyList'; break;
        default: break;
        }
        this.tabalive = type;

        if (!Vue.component(this.tabalive)) {
          Vue.component(this.tabalive, Vue.extend(todoProcess));
        } 
        this.currentComponents = this.tabalive;
      }
    },
    created() {
      if (global.displayList) {
        this.init();
      } else {
        const timer = setInterval(async () => {
          if (global.displayList) {
            clearInterval(timer);
            this.init();
          } else {
            this.tabConfig = [];
          }
        }, 10);
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
