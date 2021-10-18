<template>
  <Drawer
    v-model="messagePanel.show"
    :closable="false"
  >
    <messagePanel
      v-if="Version==='1.4'"
      :panel="messagePanel"
      @markRead="markReadNote"
      @ignoreMsg="ignoreMsg"
      @jumpTask="jumpTask"
      @nextPage="nextPage"
    />
    <message-panel-older
      v-if="Version==='1.3'"
      :panel="messagePanel"
      @markRead="markReadNote"
      @ignoreMsg="ignoreMsg"
      @jumpTask="jumpTask"
      @nextPage="nextPage"
    />
  </Drawer>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import network, { urlSearchParams } from '../../__utils__/network';
import messagePanel from '../messagePanel';
import messagePanelOlder from '../messagePanelOlder'; // 1.3
import { Version, enableGateWay, getGatewayValue, STANDARD_TABLE_LIST_PREFIX } from '../../constants/global';

export default {
  name: 'MessageList',

  components: {
    messagePanel,
    messagePanelOlder
  },

  data() {
    return {
      messagePanel: {
        show: false,
        list: [],
        loaded: true,
        start: 0,
        total: 0
      },
      Version: Version(),
    }
  },

  model: {
    props: 'value',
    event: 'change'
  },

  props: {
    // 双向绑定值
    value: {
      type: Boolean,
      default: false
    },
  },

  watch: {
    // 打开消息
    value(newVal) {
      if (newVal) {
        this.messagePanel.show = newVal
        if (newVal) {
          this.getMessages(0);
        }
      }
    },

    // 关闭消息
    'messagePanel.show'(newVal) {
      if (!newVal) {
        this.$emit('change', false)
      }
    }
  },

  computed: {
    ...mapState('global', {
      userInfo: ({ userInfo }) => userInfo,
    }),
  },

  methods: {
    ...mapActions('global', ['updataTaskMessageCount']),
    ...mapMutations('global', ['updateTaskMessageCount', 'tabOpen',]),

    // 我的任务单条跳转单对象界面
    markReadNote(item) {
      this.messagePanel.show = false;
      this.updataTaskMessageCount({ id: item.ID.val });
      const type = 'tableDetailVertical';
      const tab = {
        type,
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        id: item.ID.val
      };
      this.tabOpen(tab);
    },

    // 我的任务忽略功能
    ignoreMsg() {
      network.post(Version() === '1.3' ? '/p/cs/ignoreAllMsg' : '/p/cs/u_note/ignoreMsg', {}, {
        serviceId: enableGateWay() ? 'asynctask' : ''
      }).then((res) => {
        if (res.data.code === 0) {
          this.updateTaskMessageCount(0);
          this.getMessages(0);
        }
      });
    },

    // 请求我的任务数据
    getMessages(start) {
      const self = this;
      if (start !== undefined) {
        self.messagePanel.start = start;
        self.messagePanel.list = [];
      }
      let fixedcolumns = {};
      if (Version() === '1.3') {
        fixedcolumns = {
          OPERATOR_ID: [this.userInfo.id],
          READSTATE: ['=0'],
          TASKSTATE: ['=2', '=3']
        };
      } else {
        fixedcolumns = {
          OPERATOR_ID: [this.userInfo.id],
          READ_STATE: ['=0'],
        };
      }
      const searchdata = {
        table: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        column_include_uicontroller: true,
        fixedcolumns,
        multiple: [],
        startindex: self.messagePanel.start,
        range: 20,
        orderby: [{ column: Version() === '1.3' ? 'CP_C_TASK.ID' : 'U_NOTE.ID', asc: false }]
      };
      network.post('/p/cs/QueryList', urlSearchParams({ searchdata }), {
        serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : ''
      }).then((res) => {
        const result = res.data;
        if (!result.datas) {
          result.datas = result.data;
        }

        if (result.code === 0) {
          self.messagePanel.list = self.messagePanel.list.concat(result.datas.row);
          self.messagePanel.start = result.datas.start + result.datas.rowCount;
          self.messagePanel.total = result.datas.totalRowCount;
          // 更新消息
          this.updateTaskMessageCount(self.messagePanel.total);
        }
      });
    },

    // 跳转我的任务列表界面
    jumpTask() {
      this.messagePanel.show = false;
      const type = STANDARD_TABLE_LIST_PREFIX;
      const tab = {
        type,
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        label: this.$t('tips.myTask')
      };
      this.tabOpen(tab);
    },

    nextPage() {
      if (this.messagePanel.start < this.messagePanel.total) {
        this.getMessages();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>