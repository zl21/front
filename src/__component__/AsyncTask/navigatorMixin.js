import { mapState, mapActions } from 'vuex'

export default {
  watch: {
    userId(val) {
      if (val) {
        this.getTaskMessageCount(val)
      }
    },

    taskMessageCount(newVal, oldVal) {
      if (newVal > oldVal) {
        this.sendNotice()
      }
    },
  },

  computed: {
    ...mapState('global', {
      userInfo: ({ userInfo }) => userInfo,
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
      const stopPolling = window.localStorage.getItem('r3-stopPolling')
      if (!stopPolling) {
        this._getTaskNotice() // 来自noticeMixin.js混入文件
      }
    },
  },

  async mounted() {
    // 轮询任务数量
    this.messageTimer = setInterval(() => {
      this.getMessageCount()
    }, 3000)
  },

  created() {
    window.localStorage.setItem('r3-stopPolling', '') // 初始化通知锁。会在导入代码执行时阻止弹出异步任务通知
    window.addEventListener('checkNotice', this.sendNotice)
  },

  beforeDestroy() {
    clearInterval(this.messageTimer)
    window.removeEventListener('checkNotice', this.sendNotice)
  },
}
