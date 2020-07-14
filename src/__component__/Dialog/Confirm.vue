<!--引入曼卡龙的弹框组件-->
<template>
  <Modal
    v-model="showModal"
    :title="title"
    :width="width"
    :loading="loading"
    :title-align="titleAlign"
    :scrollable="scrollable"
    :closable="closable"
    :draggable="draggable"
    :mask="mask"
    :mask-closable="maskClosable"
    :transfer="transfer"
    :footer-hide="footerHide"
    :ok-text="okText"
    :cancel-text="cancelText"
    @on-cancel="onCancel"
    @on-ok="onOk"
  >
    <div class="show-dialog">
      <slot name="Modalsolt" />
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'Modalvue',
    props: {
      // showModal: {
      //   type: Boolean,
      //   default: () => false
      // }, // 是否可以滚动
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
        default: () => true
      }, // 是否显示遮罩层
      loading: {
        type: Boolean,
        default: () => false
      }, // 是否显示loading
      maskClosable: {
        type: Boolean,
        default: () => false
      }, // 是否可以点击叉号关闭
      transfer: {
        type: Boolean,
        default: () => true
      }, // 是否将弹层放在body内
      footerHide: {
        type: Boolean,
        default: () => false
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
      width: {
        type: Number,
        default: () => 600
      },
      confirm: {
        type: Function,
        default: () => {}
      },
      contentText: {
        type: String,
        default: () => '暂无提示'
      },
    },
    data() {
      return {
        showModal: false,
      };
    },
    mounted() {
    },
    methods: {
      open() {
        this.showModal = true;
      },
      
      // 确定
      onOk() {
        if (typeof this.confirm === 'function') {
          this.confirm();
        }
        this.$emit('on-ok');
      },
      // 取消
      onCancel() {
        if (typeof this.cancelFun === 'function') {
          this.cancelFun();
        }
        this.$emit('on-cancle');
      },
    
    }
  };
</script>

<style lang="less">
.ark-modal-footer {
  border: none;
}

.ark-modal-footer button > span {
  font-size: 12px;
}

.ark-modal-footer button {
  width: auto;
  border-radius: 2px;
  height: 26px;
  line-height: 0px;
}
.show-dialog{
  position: relative;
}
</style>
