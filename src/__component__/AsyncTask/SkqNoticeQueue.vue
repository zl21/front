<template>
  <div id="r3-skq-notice-queue">
    <div class="r3-skq-notice-queue-head">
      <div class="r3-skq-notice-head-l">
        <!-- 任务列表标题 -->
        <Poptip
          trigger="hover"
          transfer
          placement="bottom-end"
          v-model="showFilter"
          v-if="dialogType === 'list'"
        >
          <div class="r3-skq-task-state">
            <span class="r3-skq-filter-panel">{{title}}</span>
            <Icon
              type="ios-arrow-down"
              size="18"
            ></Icon>
          </div>

          <div slot="content">
            <div
              @click.stop="filterTask(i)"
              class="state-item"
              v-for="(state , i) in filterStates"
              :key="i"
            >{{state}}</div>
          </div>
        </Poptip>

        <!-- 任务通知标题 -->
        <div v-else>
          <span class="r3-skq-filter-panel">{{title}}</span>
        </div>

      </div>
      <div class="r3-skq-notice-head-r">
        <span
          class="r3-skq-view-all"
          @click.stop="viewAllTasks"
        >{{$t('buttons.view')}}{{$t('tips.all')}}</span>
        <Icon
          type="ios-close"
          size="22"
          @click="close"
        ></Icon>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="r3-skq-notice-queue-body">
      <Spin
        fix
        v-show="isLoading"
        size="large"
      ></Spin>
      <transition-group
        name="r3-slide-fade"
        :duration='removeDuration'
      >
        <div
          class="r3-task-item"
          v-for="item in tasks"
          :key="item.id"
        >
          <div class="r3-skq-notice-body-l">
            <svg
              class="notice-ongoing"
              viewBox="25 25 50 50"
              v-if="item.statusCode === 1"
            >
              <circle
                class="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke-width="5"
                stroke-miterlimit="10"
              ></circle>
            </svg>
            <Icon
              type="ios-checkmark-circle-outline"
              size="16"
              class="notice-success"
              v-if="item.statusCode === 2"
            />
            <Icon
              type="ios-close-circle-outline"
              size="16"
              class="notice-error"
              v-else-if="item.statusCode === 3"
            />
          </div>
          <div class="r3-skq-notice-body-m">
            <div class="r3-task-content">
              <span :title="item.content">{{item.content}}</span>
              <div class="one-line-flow task-title">
              </div>
              <a
                v-if="item.url && item.statusCode === 2"
                :href="item.url"
                :style="item.isRead ? 'color:#7f1bab' : 'color:#0F8EE9'"
                download
                @click.stop="downloadTask(item)"
              >【{{$t('messages.downloadFile')}}】</a>
              <a
                v-else
                :style="item.isRead ? 'color:#7f1bab' : 'color:#0F8EE9'"
                @click.stop="viewTask(item)"
              >【{{$t('tips.details')}}】</a>
            </div>

            <div
              class="r3-task-subtitle"
              v-if="dialogType==='list'"
            >
              <span>{{item.beginTime}}</span>
            </div>
          </div>
        </div>
      </transition-group>
      <!-- 底部提示 -->
      <div
        class="bottom-tip"
        @click.stop="viewAllTasks"
        v-if="dialogType === 'list' && tasks.length < totalTasks"
      >{{$t('buttons.view')}}{{$t('tips.all')}}{{$t('tips.task')}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../assets/js/i18n/index'
import {
  getTaskMessage,
  getCreatedTime,
  getUrl,
  getTaskCode,
  getTaskVal,
  getTaskName
} from '../../__utils__/task-utils'

export default {
  name: 'R3SkqNoticeQueue',

  props: {
    // 任务列表
    list: {
      type: Array,
      required: true
    },

    // 总任务数量
    totalTasks: {
      type: Number,
      default: 0
    },

    // 进行中任务数量
    ongoingTasks: {
      type: Number,
      default: 0
    },
    // 弹框类型： 任务列表，任务通知
    dialogType: {
      type: String,
    },
    // 是否是加载中
    isLoading: {
      type: Boolean,
    }
  },

  watch: {
    list: {
      handler(newVal) {
        this.tasks = this.filterList(newVal)
      },
      immediate: true,
      deep: true
    }
  },

  computed: {
    count() {
      if (this.currentStatesCode === 0) {
        return `${this.ongoingTasks}/${this.totalTasks}`
      } else {
        return `${this.totalTasks}`
      }
    },

    title() {
      if (this.dialogType === 'list') {
        return `${this.currentStates}（${this.count}）`
      } else {
        return `${this.$t('tips.myTask')}`
      }
    },
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  data() {
    return {
      tasks: [],
      showFilter: false,
      removeDuration: 0, // 动画过渡时间
      filterStates: [`${this.$t('tips.all')}${this.$t('tips.task')}`, `${this.$t('feedback.ongoing')}${this.$t('tips.task')}`, `${this.$t('tips.completed')}${this.$t('tips.task')}`],
      currentStates: `${this.$t('tips.all')}${this.$t('tips.task')}`, // 任务状态值
      currentStatesCode: 0 // // 任务状态码
    }
  },

  methods: {
    // 重新定义数据结构
    filterList(list) {
      const newList = []
      list.forEach((item) => {
        let content = ''
        const menu = item.MENU.val
        const statusVal = getTaskVal(item)
        const beginTime = getCreatedTime(item)
        const name = getTaskName(item)
        if (this.dialogType === 'list') {
          content = `${name}:【${menu}】${statusVal}`
        } else {
          content = `${beginTime}【${menu}-${name}】，${statusVal}`
        }

        newList.push({
          id: item.ID.val,
          beginTime,
          msg: getTaskMessage(item),
          statusCode: getTaskCode(item),
          statusVal,
          menu,
          url: getUrl(item),
          readStatus: item.READ_STATE,
          content,
          name,
          isRead: false // 是否已读
        })
      })
      return newList
    },

    // 将任务设置为已读
    async downloadTask(task) {
      this.removeDuration = 500
      const readTask = this.tasks.find(item => item.id === task.id)
      readTask.isRead = true
      this.$emit('on-download', task)
    },

    // 筛选任务
    filterTask(val) {
      this.removeDuration = 0
      this.showFilter = false
      let taskState
      // 全部任务
      if (val === 0) {
        taskState = undefined
      } else if (val === 1) {
        // 进行中
        taskState = ['=1']
      } else if (val === 2) {
        // 完成和失败的任务
        taskState = ['=2', '=3']
      }
      this.currentStates = this.filterStates[val]
      this.currentStatesCode = val
      this.$emit('on-filter-tasks', taskState)
    },

    // 查看全部任务
    viewAllTasks() {
      this.$emit('on-close')
      this.$emit('on-view-all-tasks')
    },

    // 查看任务
    viewTask(task) {
      this.removeDuration = 500
      this.$emit('on-view-task', task)
    },

    close() {
      this.$emit('on-close') // 触发父组件关闭弹框
    },
  },
}

</script>

<style lang="scss" scoped>
</style>