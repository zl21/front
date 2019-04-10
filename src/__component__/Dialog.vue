<!--引入曼卡龙的弹框组件-->
<template>
  <Modal
    v-model="showModal"
    :title="title"
    :title-align="titleAlign"
    :scrollable="scrollable"
    :closable="closable"
    :draggable="draggable"
    :mask="mask"
    :mask-closable="maskClosable"
    :transfer="transfer"
    :name="name"
    :footer-hide="footerHide"
    :ok-text="okText"
    :cancel-text="cancelText"
    @on-cancel="onCancel"
    @on-ok="onOk"
    @on-keydown="keydown($event)"
  />
</template>

<script>
  export default {
    name: 'JordanDialog',
    props: {
      showModal: {
        type: Boolean,
        default: () => false
      }, // 是否可以滚动
      title: {
        type: String,
        default: () => '标题'
      }, // 设置标题title
      titleAlign: {
        type: String,
        default: () => 'left'
      }, // 设置标题是否居中 // center left
      scrollable: {
        type: Boolean,
        default: () => false
      }, // 是否可以滚动
      closable: {
        type: Boolean,
        default: () => true
      }, // 是否可以按esc关闭
      draggable: {
        type: Boolean,
        default: () => true
      }, // 是否可以拖动
      mask: {
        type: Boolean,
        default: () => false
      }, // 是否显示遮罩层

      maskClosable: {
        type: Boolean,
        default: () => true
      }, // 是否可以点击叉号关闭
      transfer: {
        type: Boolean,
        default: () => true
      }, // 是否将弹层放在body内
      name: {
        type: String,
        default: () => ' '
      }, // 组件名称
      url: {
        type: String,
        default: () => ' '
      }, // 组件路由
    
      footerHide: {
        type: Boolean,
        default: () => true
      }, // 是否显示底部
      okText: {
        type: String,
        default: () => '确定'
      },
      cancelText: {
        type: String,
        default: () => '取消'
      },
      cancelFun: {
        type: Function,
        default: () => {}
      },
      confirm: {
        type: Function,
        default: () => {}
      },
      quit: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        modal: true,
        commonObj: {},
      };
    },
    mounted() {
    },
    methods: {
      // 确定
      onOk() {
        if (typeof this.confirm === 'function') {
          this.confirm();
        }
      },
      // 取消
      onCancel() {
        if (typeof this.quit === 'function') {
          this.quit();
        }
      }
    }
  };
</script>

<style lang="less">
.burgeon-modal-footer {
  border: none;
}

.burgeon-modal-footer button > span {
  font-size: 12px;
}

.burgeon-modal-footer button {
  width: auto;
  border-radius: 2px;
  height: 26px;
  line-height: 0px;
}
</style>
