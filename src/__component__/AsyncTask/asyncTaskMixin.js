import network, { urlSearchParams } from '../../__utils__/network'
import {
  ADD_TASK,
  DispatchEvent,
  R3_EXPORT,
  UPDATE_TASK,
} from '../../__utils__/dispatchEvent'
import { enableInitializationRequest, Version, enableGateWay } from '../../constants/global'

export default {
  data() {
    return {
      exportTimer: undefined,
    }
  },

  methods: {
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

    // 绑定导出事件
    attachEvent(eventName) {
      window.addEventListener(eventName, this.R3handleExport)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener(eventName, this.R3handleExport)
      })
    },
  },

  mounted() {
    this._taskTableName = Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE' // 【我的任务】表明
    this.attachEvent(R3_EXPORT)
  },
}
