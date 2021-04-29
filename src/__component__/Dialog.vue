<template>
  <Modal
    v-model="showModal"
    :title="titleName"
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
        :select-row-data="selectRowData"
        :item-id="itemId"
        :popwin-message="popwinMessage"
        :obj-tab-action-dialog-config="objTabActionDialogConfig"
        :externalOptions="externalOptions"
        @setTitle="setTitle"
        @closeActionDialog="closeActionDialog"
        @clearSelectIdArray="clearSelectIdArray"
        @setValue="setValue"
        @ok="componentClickOk"
        @cancel="close"
      />
      <!-- @setValue:用来接收弹窗emit值 -->
      <!-- @clearSelectIdArray:清除勾选ID -->
      <!-- @setTitle：设置title -->
    </div>
  </Modal>
</template>

<script>
  import { DispatchEvent } from '../__utils__/dispatchEvent';

  export default {
    // name: 'DialogComponent',
    props: {
      idArray: {// 获取ID用于多选
        type: [Array, Object],
        default: () => {}
      },
      selectRowData: {// 获取ID用于多选,获取勾选的明细对应的row内的数据
        type: [Array, Object],
        default: () => {}
      },
      
      objTabActionDialogConfig: {// 当前自定义按钮配置信息
        type: [Object],
        default: () => {}
      },
      itemId: {// 获取当前子表ID
        type: String,
        default: () => ''
      },
      actionId: {// 获取自定按钮ID
        type: [Number, String],
        default: () => ''
      },
      popwinMessage: {// 获取popwin类型打开自定义弹框传入元数据信息
        type: Object,
        default: () => {}
      },
      
      // showModal: {
      //   type: Boolean,
      //   default: () => false
      // }, // 是否可以滚动
      // width: {
      //   type: String,
      //   default: () => 'auto'
      // },
      // zIndex: { // 层级
      //   type: Number,
      //   default: 1000
      // },
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
      // 给内容组件的所有参数
      externalOptions: {
        type: Object,
        default: () => {}
      }
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
      dialogComponentName() {
        // 重置组件内设置的属性，避免其它组件唤起弹框时，重复使用上一次设置的属性值
        this.modalWidth = 520;
        this.setTitleName = '';
        this.getModalWidth();
      },
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
          if (this.$refs.modalComponent.$el.clientWidth + 32 > (document.body.clientWidth - 200)) {
            this.modalWidth = document.body.clientWidth - 200;
          } else {
            this.modalWidth = this.$refs.modalComponent.$el.clientWidth + 32;
          }
        } else {
          setTimeout(() => { // 释放资源
            self.getModalWidth();
          }, 0);
        }
      },
      open() {
        this.showModal = true;
      },
      close() {
        this.showModal = false;
      },
      componentClickOk() {
        if (typeof this.confirm === 'function') {
          this.confirm();
          this.close();
        }
      },
      // 确定
      onOk() {
        if (typeof this.confirm === 'function') {
          this.confirm();
        }
      },
      // 取消
      onCancel() {
        // 自定义弹框点iconX关闭时，需在定制界面内提供clickIconX（）方法，可在关闭弹框前执行clickIconX方法的相关逻辑
        if (this.$refs.modalComponent.clickIconX && typeof this.$refs.modalComponent.clickIconX === 'function') {
          this.$refs.modalComponent.clickIconX();
        }
        if (typeof this.cancelFun === 'function') {
          this.cancelFun();
        }
      },
      closeActionDialog(value, failInfo, moduleComponentName) {
        if (failInfo && failInfo.length > 0) {
          DispatchEvent('updateSTFailInfo', {// 自定义弹框支持列表界面报错在对应明细显示报错信息
            detail: {
              failInfo,
              moduleComponentName
            }
          });
        }
        this.$emit('clearDialogComponentName');
        this.showModal = false;
        if (value === true && this.objTabActionDialogConfig.isrefrsh) {
          this.$emit('dialogComponentSaveSuccess');
        } 
      },
      
   
    },
    mounted() {
      console.log('对话框', this.deo);
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
