<template>
  <div style="height:100%">
    <contentdiv />
    <!-- <Contentverticalslot>
        <NavigatorVertical slot="R3-header"/>
        <NaVertical  slot="R3-left"/>
        <ContentDisplayArea slot="R3-content" />
    </Contentverticalslot>   -->

    <!-- 我的任务列表 -->
    <SkqTasksDialog
      v-model="showTasks"
      @on-close="handleClose"
      type="list"
    ></SkqTasksDialog>
    <!-- 我的任务通知 -->
    <SkqTasksDialog
      v-model="showTasksNotice"
      @on-close="handleClose"
      type="notice"
    ></SkqTasksDialog>
  </div>
</template>

<script>
import NavigatorVertical from '../__component__/NavigatorVertical';
import NaVertical from '../__component__/NaVertical';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import contentdiv from './Content.vue';
import SkqTasksDialog from './AsyncTask/SkqTasksDialog.vue';
import asyncTaskMixin from './AsyncTask/asyncTaskMixin';
import { ADD_TASK, UPDATE_TASK, DispatchEvent } from '../__utils__/dispatchEvent'

// import Contentverticalslot from './Contentverticalslot.vue';


export default {
  data() {
    return {
      enableTabLists: true,
      showTasks: false,
      showTasksNotice: false,
      dialogType: ''
    };
  },

  components: {
    contentdiv,
    NavigatorVertical,
    NaVertical, ContentDisplayArea,
    SkqTasksDialog
  },

  mixins: [asyncTaskMixin],

  name: 'ContentTemplate',

  methods: {
    // 关闭弹框
    handleClose(type) {
      if (type === 'list') {
        this.showTasks = false
      } else {
        this.showTasksNotice = false
      }
    },

    // 绑定添加任务事件
    attachAddTaskEvent() {
      const addTask = (e) => {
        if (e.detail.type === 'list') {
          this.showTasks = true
        } else {
          this.showTasksNotice = true
        }
        DispatchEvent(UPDATE_TASK)
      }

      window.addEventListener(ADD_TASK, addTask)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener(ADD_TASK, addTask)
      })
    },
  },

  mounted() {
    this.attachAddTaskEvent()
  }
};
</script>


