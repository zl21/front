  
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
    :footer-hide="footerHide"
    :ok-text="okText"
    :cancel-text="cancelText"
    @on-ok="confirmDialog()"
    @on-cancel="closeDialog()"
  >
    <p>{{ contentText }}</p>
  </Modal>
</template>

<script>
  export default {
    name: 'ErrorModal',
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
      footerHide: {
        type: Boolean,
        default: () => false
      }, // 是否显示底部
      okText: {
        type: String,
        default: function() {
          return this.$t('buttons.confirm')
        }
      },
      cancelText: {
        type: String,
        default: function() {
          return this.$t('buttons.cancel')
        }
      },
      cancelFun: {
        type: Function,
        default: () => {}
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
      closeDialog() {
        this.$emit('closeDialog');
      },
      confirmDialog() {
        this.$emit('confirmDialog');
      }
    },
  
  };
</script>
