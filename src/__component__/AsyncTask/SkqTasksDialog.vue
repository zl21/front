<template>
  <Dialog
    ref="dialog"
    :footerHide="true"
    :closable='false'
    :mask='false'
    :width="type === 'list' ? 410 : 420"
    title=""
    dialogComponentName='skqNoticeQueue'
    :dynamicAttrs="dynamicAttrs"
    :class-name="type === 'list'?'r3-dialog-skqNoticeQueue' : 'r3-dialog-skqNotice'"
    :dynamicEvents="dynamicEvents"
  ></Dialog>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations, mapActions } from 'vuex'
import Dialog from '../Dialog.vue'
import SkqNoticeQueue from './SkqNoticeQueue.vue'
import {
  Version,
  enableGateWay,
  getGatewayValue,
} from '../../constants/global'
import network, { urlSearchParams } from '../../__utils__/network'
import { UPDATE_TASK } from '../../__utils__/dispatchEvent'
Vue.component('SkqNoticeQueue', SkqNoticeQueue)

export default {
  name: 'R3SkqTaskDialog',

  components: {
    Dialog,
  },

  model: {
    prop: 'show',
    event: 'on-visible-change',
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      require: true
    }
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

  watch: {
    show: {
      handler(val) {
        if (val) {
          this.$refs.dialog.open()
          this._getTaskList()
        } else {
          Object.assign(this.$data, this.$options.data.call(this))
          this.$refs.dialog.close()
        }
      }
    }
  },

  data() {
    return {
      dynamicEvents: {
        'on-view-all-tasks': this.onViewAllTasks,
        'on-download': this.downloadCallback,
        'on-filter-tasks': this.handlerFilter,
        'on-view-task': this.handlerViewTask,
        'on-close': this.handleClose,
        'on-show-pop': this.handleShowPop,
      },
      dynamicAttrs: {
        list: [],
        totalTasks: 0, // 总任务数量
        ongoingTasks: 0, // 进行中任务数量
        completeTasks: 0, // 已完成任务数量
        dialogType: this.type,
        isLoading: false // 接口是否在加载
      },
      taskState: undefined,
    }
  },

  methods: {
    ...mapActions('global', ['updataTaskMessageCount']),
    ...mapMutations('global', ['tabOpen', 'updateTaskMessageCount']),

    // 对话框显示
    handleClose() {
      this.$emit('on-close', this.type)
    },

    // 查看全部任务
    onViewAllTasks() {
      let taskState = []
      if (this.taskState) {
        this.taskState.forEach(item => {
          taskState.push(item.replace('=', ''))
        })
      }
      const tab = {
        type: 'S',
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        label: this.$t('tips.myTask'),
        isSetQuery: true,
        queryData: {
          tableId: Version() === '1.3' ? 24386 : 963,
          values: [//设置默认值的字段
            {
              colid: Version() === '1.3' ? '162788' : '99149', // 任务状态字段
              defaultValue: taskState,
              display: "OBJ_SELECT"
            }, {
              colid: Version() === '1.3' ? '162790' : '99152', // 已读状态字段
              defaultValue: ['0'],
              display: "OBJ_SELECT"
            }
          ]
        }
      }

      this.tabOpen(tab)
    },

    // 任务列表接口
    async _requestTaskList({ taskState = undefined, startindex = 0, range = 20 } = {}) {
      let fixedcolumns = {}
      const readStateKey = Version() === '1.3' ? 'READSTATE' : 'READ_STATE'
      const taskStateKey = Version() === '1.3' ? 'TASKSTATE' : 'TASK_STATE'
      fixedcolumns = {
        OPERATOR_ID: [this.userId],
        [readStateKey]: ['=0'],
      }

      if (taskState) {
        fixedcolumns[taskStateKey] = taskState
      }

      const searchdata = {
        table: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        column_include_uicontroller: true,
        fixedcolumns,
        multiple: [],
        startindex,
        range,
        orderby: [
          {
            column: Version() === '1.3' ? 'CP_C_TASK.ID' : 'U_NOTE.ID',
            asc: false,
          },
        ],
      }

      return new Promise((resolve, reject) => {
        network
          .post(
            `/p/cs/QueryList?hash=${this.type}${new Date().getTime()}`, // hash防止短时间内重复请求被节流
            urlSearchParams({ searchdata }),
            {
              serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : '',
            }
          ).then(res => {
            const result = res.data
            if (!result.datas) {
              result.datas = result.data
            }
            if (result.code === 0) {
              resolve(result.datas)
            } else {
              reject(result.datas)
            }

          }).catch(err => {
            reject(err)
          })
      })
    },

    // 获取任务列表
    async _getTaskList(taskState) {
      this._requestTaskList({taskState}).then((data) => {
        this.dynamicAttrs.totalTasks = data.totalRowCount
        const rows = data.row
        // 通知的话只展示5条
        if (this.type === 'list') {
          this.dynamicAttrs.list = rows
        } else {
          this.dynamicAttrs.list = rows.slice(0, 5)
          // 在读取任务的场景中，列表会出现无数据的情况。此时关闭通知
          if (this.dynamicAttrs.list.length === 0) {
            this.$emit('on-close', this.type)
          }
        }
      }).finally(() => {
        this.dynamicAttrs.isLoading = false
      })
    },

    // 绑定更新事件
    attachUpdateEvent() {
      window.addEventListener(UPDATE_TASK, this.updateTasks)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener(UPDATE_TASK, this.updateTasks)
      })
    },

    // 下载文件事件回调
    async downloadCallback(task) {
      await this.updataTaskMessageCount({ id: task.id })
      // DispatchEvent(UPDATE_TASK) // 改为监听任务数量变化自动触发更新，所以这边手动更新注释了
    },

    // 查看详情
    async handlerViewTask(task) {
      // 不是执行中的任务，会设置已读
      if (task.statusCode !== 1) {
        await this.updataTaskMessageCount({ id: task.id })
      }
      const type = 'tableDetailVertical'
      const tab = {
        type,
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        id: task.id,
        backToTop:true
      };
      this.tabOpen(tab)
      // DispatchEvent(UPDATE_TASK)
    },

    // 更新列表(在当前参数基础上获取数据)
    updateTasks() {
      if (!this.show) {
        return
      }
      this._getTaskList(this.taskState)
    },

    // 获取任务数量
    async _updateTaskCount() {
      // 是【我的任务】时才更新进行中任务数量
      if (this.type !== 'list') {
        return
      }
      // 当前是全部任务。查询进行中任务数据，并根据进行中任务数量算出已完成任务数量
      if(this.taskState === undefined) {
        this.dynamicAttrs.ongoingTasks = (await this._requestTaskList({range: 1, taskState: ['=1']})).totalRowCount
        this.dynamicAttrs.completeTasks = this.dynamicAttrs.totalTasks - this.dynamicAttrs.ongoingTasks
      }
      // 当前是进行任务。查询已完成任务数据
      if(Array.isArray(this.taskState) && this.taskState.length === 1) {
        this.dynamicAttrs.ongoingTasks = this.dynamicAttrs.totalTasks
        this.dynamicAttrs.completeTasks = (await this._requestTaskList({range: 1, taskState: ['=2','=3']})).totalRowCount
      }

      // 当前是已完成任务。查询进行中任务数据
      if(Array.isArray(this.taskState) && this.taskState.length === 2) {
        this.dynamicAttrs.completeTasks = this.dynamicAttrs.totalTasks
        this.dynamicAttrs.ongoingTasks = (await this._requestTaskList({range: 1, taskState: ['=1']})).totalRowCount
      }

      // fix: 导航栏通知icon上的数量可能和过滤框里的不一致
      if(this.dynamicAttrs.completeTasks  > this.taskMessageCount) {
        this.updateTaskMessageCount(this.dynamicAttrs.completeTasks)
      }
    },

    // 显示过滤框时
    handleShowPop() {
      this._updateTaskCount() // 更新筛选框里的数量
    },

    // 过滤
    handlerFilter(taskState) {
      this.taskState = taskState
      this._getTaskList(taskState)
    }
  },

  mounted() {
    this.attachUpdateEvent()
  }
}
</script>

<style lang="scss" scoped>
</style>