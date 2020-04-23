<template>
  <Modal
    v-model="showModal"
    :title="titleName"
    :z-index="zIndex"
    :title-align="titleAlign"
    :scrollable="scrollable"
    :closable="closable"
    :draggable="draggable"
    :mask="mask"
    :action-id="actionId"
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
        :id-array="idArray"
        :obj-list="objList"
        :action-id="actionId"
        :item-id="itemId"
        :obj-tab-action-dialog-config="objTabActionDialogConfig"
        @setTitle="setTitle"
        @closeActionDialog="closeActionDialog"
        @clearSelectIdArray="clearSelectIdArray"
        @setValue="setValue"
      />
      <!-- @setValue:用来接收弹窗emit值 -->
      <!-- @clearSelectIdArray:清除勾选ID -->
      <!-- @setTitle：设置title -->
    </div>
  </Modal>
</template>

<script>

  export default {
    // name: 'DialogComponent',
    props: {
      idArray: {// 获取ID用于多选
        type: [Array, Object],
        default: () => {}
      },
      objTabActionDialogConfig: {// 当前自定义按钮配置信息
        type: [Object],
        default: () => {}
      },
      itemId: {// 获取当前子表表名
        type: String,
        default: () => ''
      },
      actionId: {// 获取自定按钮ID
        type: [Number, String],
        default: () => ''
      },
      
      // showModal: {
      //   type: Boolean,
      //   default: () => false
      // }, // 是否可以滚动
      // width: {
      //   type: String,
      //   default: () => 'auto'
      // },
      zIndex: { // 层级
        type: Number,
        default: 1000
      },
      objList: {// 需要从外部获取的信息
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
      isrefrsh: {
        type: Boolean,
        default: () => false
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
      dialogComponentName(val, oldval) {
        if (val) {
          this.getModalWidth();
        }
      },
    },
    mounted() {
    },
    methods: {
      setValue(value) {
        this.$emit('setValue', value);
      },
      clearSelectIdArray() { // 清空列表选中项
        this.$emit('clearSelectIdArray');
      },
      setTitle(value) {
        this.setTitleName = value;
      },
      getModalWidth() {
        const self = this;
        if (this.$refs.modalComponent && this.$refs.modalComponent.$el && this.$refs.modalComponent.$el.clientWidth) {
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
        if (value === true && this.isrefrsh) {
          this.$emit('dialogComponentSaveSuccess');
        }
      },
      
   
    }
  };
</script>

<style lang="less" scoped>
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
</style>
