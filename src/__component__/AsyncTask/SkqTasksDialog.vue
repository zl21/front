<template>
  <Dialog
    ref="dialog"
    :footerHide="true"
    :closable='false'
    :mask='false'
    :width="type === 'list' ? 380 : 420"
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
  STANDARD_TABLE_LIST_PREFIX,
} from '../../constants/global'
import network, { urlSearchParams } from '../../__utils__/network'
import { UPDATE_TASK, DispatchEvent } from '../../__utils__/dispatchEvent'
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
        'on-close': this.handleClose
      },
      dynamicAttrs: {
        list: [],
        totalTasks: 0, // 总任务数量
        ongoingTasks: 0, // 进行中任务数量
        dialogType: this.type,
        isLoading: false // 接口是否在加载
      },
      taskState: undefined,
    }
  },

  methods: {
    ...mapActions('global', ['updataTaskMessageCount']),
    ...mapMutations('global', ['tabOpen']),

    // 对话框显示
    handleClose() {
      this.$emit('on-close', this.type)
    },

    // 查看全部任务
    onViewAllTasks() {
      const type = STANDARD_TABLE_LIST_PREFIX
      const tab = {
        type,
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        label: this.$t('tips.myTask'),
      }

      this.tabOpen(tab)
    },

    // 获取任务列表
    async _getTaskList({ taskState = undefined, startindex = 0, range = 20 } = {}) {
      this.dynamicAttrs.isLoading = true

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
      // hash防止短时间内重复请求被节流
      await network
        .post(
          `/p/cs/QueryList?hash=${this.type}${new Date().getTime()}`,
          urlSearchParams({ searchdata }),
          {
            serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : '',
          }
        )
        .then((res) => {
          const result = res.data
          if (!result.datas) {
            result.datas = result.data
          }
          if (result.code === 0) {
            this.dynamicAttrs.totalTasks = result.datas.totalRowCount
            const rows = result.datas.row
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
      await this.updataTaskMessageCount({ id: task.id })
      const type = 'tableDetailVertical'
      const tab = {
        type,
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        id: task.id
      };
      this.tabOpen(tab)
      // DispatchEvent(UPDATE_TASK)
    },

    // 更新列表(在当前参数基础上获取数据)
    updateTasks() {
      this._getTaskList({ taskState: this.taskState })
    },

    // 过滤
    handlerFilter(taskState) {
      this.taskState = taskState
      this._getTaskList({ taskState })
    }
  },

  mounted() {
    this.attachUpdateEvent()
  }
}
</script>

<style lang="scss" scoped>
</style>