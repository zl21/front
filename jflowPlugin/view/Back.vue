// 驳回
<template>
  <div :class="classes">
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
  import { classFix } from '../../src/constants/global';


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
    computed: {
      classes() {
        return [
          `${classFix}Back`,
        ];
      },
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
