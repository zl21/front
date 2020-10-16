// 驳回
<template>
  <div class="Back">
    <div class="content">
      <label for="">*</label>
      <Input
        v-model="returnContent"
        type="textarea"
        :rows="4"
        placeholder="请输入审批意见"
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
        @click="back"
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
  import { refreshSystem } from '../js/index';


  export default {
    props: {
      modalConfig: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        returnContent: '',
        buttonDisabled: false
      };
    },
    methods: {
      cancel() {
        window.jflowPlugin.open({ control: false });
      },
      back() {
        this.buttonDisabled = true;
        if (!this.returnContent) {
          this.$Modal.fcError({
            title: '错误',
            content: '审批意见不能为空!',
            mask: true
          });
          this.buttonDisabled = false;
          return;
        }
        const param = {};
        param.instanceId = global.jflowInfo.instanceId;
        param.userId = global.userInfo.id;
        param.nodeId = global.jflowInfo.nodeId;
        param.businessCode = global.routeInfo.itemId;
        param.businessType = global.routeInfo.tableId;
        param.businessName = global.routeInfo.tableName;
        param.description = this.returnContent; // 审批意见
        network.post(this.modalConfig.url, param).then(async (res) => {
          this.buttonDisabled = false;
          if (res.data.resultCode === 0) {
            BacklogData();
            window.jflowPlugin.open({ control: false });
            this.$Message.success(res.data.resultMsg);
            refreshSystem();
          } else {
            this.$Modal.fcError({
              title: '错误',
              content: res.data.resultMsg,
              mask: true
            });
          }
        })
          .catch(() => {
            this.buttonDisabled = false;
          });
      },
    }
  };
</script>
<style lang="less" scoped>
.Back{
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
