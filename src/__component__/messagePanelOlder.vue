<template>
  <div
    v-show="panel.show"
    :class="classes"
  >
    <div
      class="modal-backdrop"
      @click="closeMessage"
    />
    <div class="panel-main">
      <div class="panel-title">
        <label class="left">{{$t('tips.message')}}</label>
        <span
          class="right"
          @click="ignoreMsg"
        >{{$t('buttons.ignore')}}</span>
      </div>
      <div
        ref="messageBox"
        class="panel-content"
        @scroll="handleScroll"
      >
        <div
          v-if="panel.list.length == 0"
          class="no-message"
        >
          <!-- <span v-if="!panel.loaded">加载中...</span> -->
          <span>{{$t('messages.noMessage')}}</span>
        </div>
        <div
          v-for="(item, index) in messagePanel.list"
          :key="item.ID.val"
          class="panel-item"
          @click="markRead(item)"
        >
          <div class="item-time">
            <i
              class="circle green"
              :class="item.TASKSTATE.val.indexOf('完成')>=0?'green':'red'"
            />
            <span>{{ calcdateDiff(item.ENDTIME.val) || item.ENDTIME.val }}</span>
          </div>
          <div class="item-inner">
            <div class="item-title">
              <span><b>[{{$t('tips.asyncTask')}}]</b>{{$t('tips.task')}}: {{ item.MENU.val }}{{ item.TASKTYPE.val }}{{ item.TASKSTATE.val }}</span>
            </div>
            <div class="item-content">
              <p style="-webkit-box-orient:vertical;">
                {{ (item.CONTENT.val.substring(0, 200)) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-bottom">
        <span
          class="right"
          @click="jumpTask"
        >{{$t('tips.allTasks')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { classFix } from '../constants/global';

  export default {
    props: {
      panel: {
        type: Object,
        default: () => ({})
      },
    },
    computed: {
      messagePanel() {
        return this.panel;
      },
      classes() {
        return [
          `${classFix}message-panel`,
        ];
      },
    },
    watch: {
      panel(val) {
        if (!val.show) {
          this.$refs.messageBox.scrollTop = 0;
        }
      }
    },
    data() {
      return {
        readMore: {
          isShow: false,
          currentItem: ''
        }
      };
    },
    mounted() {
    },
    methods: {
      handleScroll() {
        if (this.$refs.messageBox.scrollTop / this.$refs.messageBox.scrollHeight > 0.1) {
          this.$emit('nextPage');
        }
      },
      moreDescription(item) {
        item.isShow = !item.isShow;
      },
      markRead(item) { // 触发navBar 标记已读方法
        this.$emit('markRead', item);
      },
      closeMessage() {
        this.messagePanel.show = false;
      },
      ignoreMsg() {
        this.$emit('ignoreMsg');
      },
      calcdateDiff(date) {
        return date;
      },
      jumpTask() {
        this.$emit('jumpTask');
      }
    }
  };
</script>


