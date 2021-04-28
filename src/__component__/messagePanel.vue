<template>
  <div
    v-show="panel.show"
    class="message-panel"
  >
    <div
      class="modal-backdrop"
      @click="closeMessage"
    />
    <div class="panel-main">
      <div class="panel-title">
        <label class="left">消息</label>
        <span
          class="right"
          @click="ignoreMsg"
        >忽略</span>
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
          <span>目前没有未读消息</span>
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
              :class="item.TASK_STATE.val.indexOf('完成')>=0?'green':'red'"
            />
            
            <span>{{ calcdateDiff(item.MODIFIEDDATE.val) || item.MODIFIEDDATE.val }}</span>
          </div>
          <div class="item-inner">
            <div class="item-title">
              <span><b>[异步任务]</b>任务: {{ item.MENU.val }}</span>
            </div>
            <div class="item-content">
              <p style="-webkit-box-orient:vertical;">
                {{ (item.MESSAGE.val.substring(0, 200)) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-bottom">
        <span
          class="right"
          @click="jumpTask"
        >全部任务</span>
      </div>
    </div>
  </div>
</template>

<script>

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
      }
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


<style lang="less" scoped>
  .modal-backdrop {
    position: fixed;
    z-index: 1040;
    background-color: #000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: .5;
  }

  .panel-main {
    background: #fff;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0px;
    width: 300px;
    overflow: auto;
    z-index: 20000;
    .panel-title {
      border-bottom: 1px solid #DCDCDC;
      height: 30px;
      padding: 4px 10px;
      .left {
        color: #575757;
        display: inline-block;
        font-size: 13px;
        font-weight: bold;
        line-height: 30px;
        height: 30px;
      }
      .right {
        color: #888888;
        cursor: pointer;
        display: inline-block;
        float: right;
        font-size: 12px;
        line-height: 30px;
        height: 30px;
      }
    }
    .panel-content {
      padding: 10px;
      position: absolute;
      top: 40px;
      bottom: 40px;
      overflow: auto;
      left: 0;
      right: 0;
      .panel-item {
        padding: 0 10px;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        .item-title {
          color: #575757;
          font-size: 13px;
          height: 30px;
          line-height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          b {
            font-weight: bold;
          }
        }
        .item-time {
          color: #888888;
          font-style: italic;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          margin-left: -4px;
          .circle {
            background-color: #F7F8FD;
            border-radius: 5px;
            display: inline-block;
            height: 10px;
            width: 10px;
            &.green {
              background-color: #9ACE57;
            }
            &.orange {
              background-color: #FCB322;
            }
            &.red {
              background-color: #E74D59;
            }
          }
        }
        .item-inner {
          border-left: 1px solid #DCDCDC;
          padding-left: 14px;
          padding-bottom: 12px;
        }
        &:last-child {
          .item-inner {
            border-left: 1px solid #ffffff;
          }
        }
        .item-content {
          background-color: #F7F8FD;
          color: #888888;
          font-size: 12px;
          line-height: 14px;
          padding: 6px;
          p {
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .item-more {
          width: 16px;
          height: 16px;
          padding: 1px;
          color: #c1c1c1;
          position: absolute;
          right: 10px;
          bottom: 10px;
          transition: 0.35s;
          -moz-transition: .35s; /* Firefox 4 */
          -webkit-transition: .35s; /* Safari 和 Chrome */
          -o-transition: .35s; /* Opera */
        }
        .item-more.isopen {
          transform: rotate(180deg);
          -ms-transform: rotate(180deg); /* IE 9 */
          -moz-transform: rotate(180deg); /* Firefox */
          -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
          -o-transform: rotate(180deg); /* Opera */
        }
        .message-icon {
          color: #fd6442;
          width: 13px;
          height: 13px;
          position: relative;
          top: -1px;
        }
      }
    }
    .panel-bottom {
      position: absolute;
      bottom: 0;
      height: 25px;
      right: 10px;
      left: 10px;
      font-size: 12px;
      text-align: center;
      span {
        cursor: pointer;
      }
    }

    .no-message {
      text-align: center;
      font-size: 14px;
      margin: 20px;
    }
  }
</style>
