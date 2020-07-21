// 转派
<template>
  <div class="Delegate">
    <div class="content">
      <mutipleSelectPop
        v-if="modalConfig.control"
        ref="dialogtest"
        :node-id="modalConfig.nodeId"
        :is-mutiple="false"
        :is-use="false"
        @getResult="getResult"
      />
    </div>

    <div class="footer">
      <Button
        type="text"
        :disabled="buttonDisabled"
        @click="cancel"
      >
        取消
      </Button>
      <Button
        type="primary"
        :disabled="buttonDisabled"
        @click="confirm"
      >
        确定
      </Button>
    </div>
  </div>
</template>
<script>
  import { BacklogData } from '../js/todoList';
  import network from '../utils/network';
  import { global } from '../utils/global.config';
  import mutipleSelectPop from './MutipleSelectPop';
  import { refreshSystem } from '../js/index';

  export default {
    props: {
      modalConfig: {
        type: Object,
        default: () => ({})
      }
    },
    components: { mutipleSelectPop },
    data() {
      return {
        returnContent: '',
        buttonDisabled: false,
        selectRow: []
      };
    },
    methods: {
      cancel() {
        window.jflowPlugin.open({ control: false });
      },
      confirm() {
        if (this.selectRow && this.selectRow.length === 0) {
          this.$Modal.fcError({
            title: '错误',
            content: '请选择转派人员',
            mask: true
          });
          return;
        }
        const param = {};
        param.instanceId = global.jflowInfo.instanceId;
        param.userId = global.userInfo.id;
        param.delegateId = this.selectRow.ID; // 驳回节点id
        network.post(this.modalConfig.url, param).then(async (res) => {
          if (res.data.resultCode === 0) {
            window.jflowPlugin.open({ control: false });
            BacklogData();
            this.$Message.success(res.data.resultMsg);
            this.selectRow = {};
            refreshSystem();
          } else {
            this.$Modal.fcError({
              title: '错误',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      },
      getResult(data) {
        this.selectRow = data.list[0];
      },
    }
  };
</script>
<style lang="less" scoped>
.Delegate{
  .content{
    padding: 16px;
    display: flex;
    align-items: center;

    >label{
      margin-right: 5px;
      color: red;
      font-size: 20px;
    }
  }
  .footer{
    border-top: 1px solid #e8eaec;
    padding: 8px 20px 8px 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    text-align: right;
  }
}
</style>
