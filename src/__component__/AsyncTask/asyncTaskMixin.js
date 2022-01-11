import SkqTasksDialog from './SkqTasksDialog.vue';
import network, { urlSearchParams } from '../../__utils__/network'
import {
  ADD_TASK,
  DispatchEvent,
  R3_EXPORT,
  UPDATE_TASK,
  R3_IMPORT
} from '../../__utils__/dispatchEvent'
import {
  enableInitializationRequest,
  Version,
  enableGateWay,
} from '../../constants/global'

export default {
  data() {
    return {
      exportTimer: undefined,
      showTasks: false,
      showTasksNotice: false,
    }
  },

  components: {
    SkqTasksDialog
  },

  methods: {
    //处理导出逻辑
    R3handleExport(e) {
      const { url, apiParams } = e.detail

      network
        .post(url || '/p/cs/export', urlSearchParams(apiParams))
        .then((res) => {
          // 添加任务到任务列表
          DispatchEvent(ADD_TASK, {
            detail: {
              type: 'notice',
            },
          })

          // 后台轮询，更新任务状态
          if (res.data.code === 0) {
            this.checkTaskState(res.data.data)
          }
        })
    },

    // 轮询单对象，查看表单里【任务状态】来判断任务是否完成
    checkTaskState(objid) {
      if (!enableInitializationRequest()) {
        return
      }
      const times = 5 // 循环的次数
      const interval = 1000 // 事件间隔
      let index = 0 // 当前次数

      this.exportTimer = setInterval(() => {
        index++
        if (index > times) {
          clearInterval(this.exportTimer)
        } else {
          this.requestExport(objid)
        }
      }, interval)
    },

    // 请求导出接口
    requestExport(objid) {
      const params = urlSearchParams({ table: this._taskTableName, objid })
      const serviceId = window.localStorage.getItem('serviceId')
      network
        .post('/p/cs/getObject', params, {
          serviceId: enableGateWay() ? serviceId : '',
        })
        .then((res) => {
          const data = res.data
          if (data.code === 0) {
            // 根据基本信息里的任务状态判断是否需要更新任务状态
            const baseInfo = data.data.addcolums.filter(
              (item) => item.parentdesc === '基础信息'
            )
            const formItem = baseInfo.length > 0 ? baseInfo[0].childs : []
            formItem.forEach((item) => {
              if (item.colname === 'TASK_STATE') {
                // 2代表任务成功,3代表任务异常
                if (['2', '3'].includes(item.valuedata)) {
                  DispatchEvent(UPDATE_TASK)
                  clearInterval(this.exportTimer)
                }
              }
            })
          }
        })
    },

    // 处理添加任务
    handleUpdateTask(e) {
      if (e.detail.type === 'list') {
        this.showTasks = true
      } else {
        this.showTasksNotice = true
      }
      DispatchEvent(UPDATE_TASK)
    },

    // 关闭弹框
    handleClose(type) {
      if (type === 'list') {
        this.showTasks = false
      } else {
        this.showTasksNotice = false
      }
    },

    // 绑定导出事件
    attachEvent(eventName, callback) {
      window.addEventListener(eventName, callback)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener(eventName, callback)
      })
    },
  },

  mounted() {
    this._taskTableName = Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE' // 设置【我的任务】表名
    this.attachEvent(R3_EXPORT, this.R3handleExport)
    this.attachEvent(R3_IMPORT, this.handleUpdateTask)
    this.attachEvent(ADD_TASK, this.handleUpdateTask)
  },
}
