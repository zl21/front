import { mapState, mapActions } from 'vuex'
import noticeMixin from './noticeMixin'
import { ADD_TASK, DispatchEvent, UPDATE_TASK} from '../../__utils__/dispatchEvent'
import {
  asyncTaskScheme
} from '../../constants/global';

export default {
  mixins: [noticeMixin],

  data() {
    return {
      showTaskIcon: asyncTaskScheme() === 'skq'
    }
  },

  watch: {
    userId(val) {
      if (val) {
        this.getTaskMessageCount(val)
      }
    },

    taskMessageCount(newVal, oldVal) {
      // 如果是斯凯奇的异步方案
      if(asyncTaskScheme() === 'skq') {
        DispatchEvent(UPDATE_TASK)
        return
      }
      if (newVal > oldVal) {
        this.sendNotice()
      }
    },
  },

  computed: {
    ...mapState('global', {
      userInfo: ({ userInfo }) => userInfo,
      taskMessageCount: state => state.taskMessageCount,
    }),

    userId() {
      return this.userInfo && this.userInfo.id
    },
  },

  methods: {
    ...mapActions('global', ['getTaskMessageCount']),

    getMessageCount() {
      if (!this.userInfo.id) {
        return
      }
      this.getTaskMessageCount(this.userInfo.id)
    },

    // 发送右下角消息通知
    sendNotice() {
      const stopPolling = window.localStorage.getItem('r3-stopPolling') // 是否阻止轮询
      if (!stopPolling) {
        this._getTaskNotice() // 来自noticeMixin.js混入文件。调用右下角通知
      }
    },

    // 绑定通知检查事件
    attachCheckEvent() {
      window.addEventListener('checkNotice', this.sendNotice)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('checkNotice', this.sendNotice)
      })
    },

    // 绑定消息轮询
    attachMessagePolling() {
      const time = asyncTaskScheme() === 'skq' ? 10000 : 5000
      this.messageTimer = setInterval(() => {
        this.getMessageCount()
      }, time)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.messageTimer)
      })
    },

    // 打开任务列表弹框
    handlerOpenTasks() {
      DispatchEvent(ADD_TASK, {
        detail: {
          type: 'list'
        }
      }) // 触发通知检测
    }
  },

  async mounted() {
    // 轮询任务数量
    this.attachMessagePolling()
  },

  created() {
    window.localStorage.setItem('r3-stopPolling', '') // 初始化通知锁。会在导入代码执行时阻止弹出异步任务通知
    this.attachCheckEvent()
  },
}
