import { Version, enableGateWay, getGatewayValue } from '../../constants/global'
import network, { urlSearchParams } from '../../__utils__/network'
import taskNotice from './taskNotice.vue'
Vue.component('taskNotice', taskNotice)

const mixin = {
  methods: {
    // 获取通知
    async _getTaskNotice() {
      if (!window.ProjectConfig.enableTaskNotice) {
        return
      }
      await this._getTaskList()
      this._getDiffTask()
      this._showNotice()
    },

    // 获取任务列表
    async _getTaskList() {
      let fixedcolumns = {}
      if (Version() === '1.3') {
        fixedcolumns = {
          OPERATOR_ID: [this.userId],
          READSTATE: ['=0'],
          TASKSTATE: ['=2', '=3'],
        }
      } else {
        fixedcolumns = {
          OPERATOR_ID: [this.userId],
          READ_STATE: ['=0'],
        }
      }
      const searchdata = {
        table: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        column_include_uicontroller: true,
        fixedcolumns,
        multiple: [],
        startindex: 0,
        range: 20,
        orderby: [
          {
            column: Version() === '1.3' ? 'CP_C_TASK.ID' : 'U_NOTE.ID',
            asc: false,
          },
        ],
      }
      await network
        .post('/p/cs/QueryList', urlSearchParams({ searchdata }), {
          serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : '',
        })
        .then((res) => {
          const result = res.data
          if (!result.datas) {
            result.datas = result.data
          }

          if (result.code === 0) {
            this._newTasks = result.datas.row
            console.log('🚀 ~ 新', this._newTasks)
          }
        })
    },

    // 获取新增的任务
    _getDiffTask() {
      console.log('旧的---', this._oldTasks)
      // 第一次开启通知的用户可能没缓存队列，为了避免第一次登录就弹出很多弹框，此处特殊处理下
      if (localStorage.getItem('r3-oldTasks') === null) {
        this._oldTasks = this._newTasks
        this._diffTasks = []
        localStorage.setItem('r3-oldTasks', JSON.stringify(this._oldTasks))
        return
      }

      // 如果旧任务为空，全量展示任务
      if (this._oldTasks.length === 0) {
        this._oldTasks = this._newTasks
        this._diffTasks = this._newTasks
        localStorage.setItem('r3-oldTasks', JSON.stringify(this._oldTasks))
        return
      }

      const oldTask = this._oldTasks[0]
      // 找出旧任务在新任务队列的位置
      const oldTaskIndex = this._newTasks.findIndex(
        (task) => task.ID.val === oldTask.ID.val
      )
      if (oldTaskIndex > -1) {
        this._diffTasks = this._newTasks.slice(0, oldTaskIndex)
      } else {
        this._diffTasks = this._newTasks
      }
      this._oldTasks = this._newTasks
      localStorage.setItem('r3-oldTasks', JSON.stringify(this._oldTasks))
    },

    // 定时器
    _sleep(callback, interval) {
      return new Promise((resolve) => {
        setTimeout(() => {
          callback()
          resolve()
        }, interval)
      })
    },

    // 弹出通知
    async _showNotice() {
      this._diffTasks = this._diffTasks.slice(0, 10) // 上限展示10条
      for (let i = 0; i < this._diffTasks.length; i++) {
        const item = this._diffTasks[i]
        const options = {
          duration: 2.5,
          position: 'bottom-right',
          contentComponent(h, closeFn) {
            return h('taskNotice', {
              props: {
                info: item,
                close: closeFn,
              },
            })
          },
        }
        // 加个延迟，这样弹出时，不会同时出现 滑入的动画 效果
        await this._sleep(() => {
          this.$Notice.info(options)
        }, 100)
      }
    },
  },

  async created() {
    const cache = localStorage.getItem('r3-oldTasks') || '[]' // 防止浏览器刷新后，丢失已弹出的任务队列
    this._oldTasks = JSON.parse(cache) // 缓存旧的任务
    this._newTasks = [] // 最新的任务列表
    this._diffTasks = [] // 新增任务
  },
}

export default mixin
