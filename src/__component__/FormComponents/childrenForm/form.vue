<template>
  <div>
    <panelForm
      v-bind="$attrs"
      ref="panelForm"
      :CollapseName="CollapseName"
      :tableName="tableName"
      :showPlace="name"
      @on-keydown="enterForm"
      :defaultData="formList"
    ></panelForm>
  </div>
</template>
<script>
import CollapseName from './CollapseComponent.vue';

export default {
  name: 'childrenForm',
  data() {
    return {
      CollapseName: CollapseName,
      name: 'childrenForm',
      formList: {
        addcolums: [
          {
            childs: [],
          },
        ],
        id: -1,
        objviewcol: 4,
      }, //控制面板的展开数据
    };
  },
  props: {
    defaultData: {
      //表单数据
      type: [Array, Object],
    },
    tableName: {
      type: String,
    },
  },
  watch: {
    defaultData: {
      handler() {
        //处理展开面板的默认值
        this.setFormList();
      },
      deep: true,
    },
  },
  methods: {
    setFormList() {
      this.formList.addcolums[0].childs = this.defaultData.inpubobj.concat([]);
    },
    initFormPanel(val, change, valLabel) {
      return this.$parent.initForm(val, change, valLabel);
    },
    InitializationForm(val, change, valLabel) {
      return this.$parent.initFormPanel(val, change, valLabel);
    },
    formPanelChange() {
      if (this.$parent.formChange) {
        let $child = this.$refs.panelForm;
        this.$parent.formChange(
          {},
          {},
          {},
          $child.formData,
          $child.formDataLabel,
          $child.defaulDataValue
        );
      }
    },
    formChange() {
      // console.log(232323);
      // if (this.$parent.formChange) {
      //     let $child = this.$refs.panelForm;
      //     this.$parent.formChange({},{},{},$child.formData, $child.formDataLabel,$child.defaulDataValue);
      // }
    },
    enterForm(e) {
      if (e.keyCode === 13) {
        setTimeout(() => {
          this.$parent.verifyForm([]);
          if (this.$parent) {
            if (Object.keys(this.$refs.panelForm.formChangeData).length > 0) {
              // 判断页面是否有值修改
              this.$refs.panelForm.checkedChildForm = true;
            } else {
              // 页面直接回车校验
              this.$refs.panelForm.checkedChildForm = false;
              let errorTip = {
                messageTip: [],
                validateForm: {},
              };
              let message = this.$refs.panelForm.validate();
              errorTip.messageTip = message.map((item) => {
                return item.tip;
              });
              if (errorTip.messageTip.length > 0) {
                let validateForm = document.querySelector(
                  `#${message[0].colname}`
                );
                if (validateForm) {
                  errorTip.validateForm =
                    validateForm.querySelector('input') ||
                    validateForm.querySelector('textarea');
                }
                console.log(errorTip, '====');
                this.$parent.verifyForm(errorTip);
              }
            }
            let checked = document
              .querySelector('.singleObjectButton')
              .__vue__.verifyRequiredInformation();

            if (checked) {
              this.$parent.enterClick();
            }
          }
        }, 100);
      }
    },
  },
  mounted() {
    this.setFormList();
  },
};
</script>
