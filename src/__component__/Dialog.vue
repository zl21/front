<!--引入曼卡龙的弹框组件-->
<template>
  <Modal
    v-model="showModal"
    :title="titleName"
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
    :width="modalWidth"
    @on-cancel="onCancel"
    @on-ok="onOk"
  >
    <p v-if="contentText">
      {{ contentText }}
    </p>
    <div v-if="dialogComponentName">
      <component
        :is="dialogComponentName"
        v-if="showModal"
        ref="modalComponent"
        :obj-list="objList"
        @setTitle="setTitle"
        @closeActionDialog="closeActionDialog"
      />
    </div>
  </Modal>
</template>

<script>

  export default {
    // name: 'DialogComponent',
    props: {
      // showModal: {
      //   type: Boolean,
      //   default: () => false
      // }, // 是否可以滚动
      // width: {
      //   type: String,
      //   default: () => 'auto'
      // },
      objList: {
        type: Array,
        default: () => []
      },
      dialogComponentName: {
        type: String,
        default: () => ''
      }, // 设置组件
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
      confirm: {
        type: Function,
        default: () => {}
      },
      contentText: {
        type: String,
        default: () => ''
      },
    },
    data() {
      return {
        showModal: false,
        modalWidth: 520,
        setTitleName: ''
      };
    },
    computed: {
      titleName() {
        if (this.setTitleName) {
          return this.setTitleName;
        }
        return this.title;
      }
    },
    watch: {
      dialogComponentName(val) {
        if (val) {
          this.getModalWidth();
        }
      }
    },
    mounted() {
    },
    methods: {
      setTitle(value) {
        this.setTitleName = value;
      },
      getModalWidth() {
        const self = this;
        if (this.$refs.modalComponent) {
          this.modalWidth = this.$refs.modalComponent.$el.clientWidth + 32;
        } else {
          setTimeout(() => { // 释放资源
            self.getModalWidth();
          }, 0);
        }
      },
      open() {
        this.showModal = true;
      },
      // 确定
      onOk() {
        if (typeof this.confirm === 'function') {
          this.confirm();
        }
      },
      // 取消
      onCancel() {
        if (typeof this.cancelFun === 'function') {
          this.cancelFun();
        }
      },
      closeActionDialog(value) {
        this.$emit('clearDialogComponentName');
        this.showModal = false;
        if (value === true) {
          this.$emit('dialogComponentSaveSuccess');
        }
      },
      
   
    }
  };
</script>

<style lang="less" scope>
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
