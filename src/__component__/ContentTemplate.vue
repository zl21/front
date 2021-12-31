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
import asyncTaskMixin from './AsyncTask/asyncTaskMixin';


export default {
  data() {
    return {
      enableTabLists: true,
      
    };
  },

  components: {
    contentdiv,
    NavigatorVertical,
    NaVertical, ContentDisplayArea,
  },

  mixins: [asyncTaskMixin],

  name: 'ContentTemplate',

  methods: {
  },

  mounted() {
  }
};
</script>


