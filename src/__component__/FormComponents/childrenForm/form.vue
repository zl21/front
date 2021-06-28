<template>
<div>
     <panelForm
      v-bind="$attrs"
      ref="panelForm"
      :CollapseName="CollapseName"
       @on-keydown="enterForm"
      :defaultData="formList"
    ></panelForm>
</div>
</template>
<script>
import CollapseName from './CollapseComponent.vue';

export default {
      name:'childrenForm',
      data(){
          return {
                CollapseName:CollapseName,
                formList: {
                    addcolums:[{
                       childs:[]
                    }],
                    objviewcol:4
                },  //控制面板的展开数据
            }

      },
      props:{
          defaultData: {  //表单数据
            type: [Array, Object]
          },
      },
      watch:{
        defaultData: {
            handler () {  //处理展开面板的默认值
                this.setFormList();

            },
            deep: true
        },

      },
      methods:{
            setFormList(){
                this.formList.addcolums[0].childs = this.defaultData.inpubobj.concat([])
            },
            InitializationForm(){
                return this.$parent.InitializationForm
            },
            initFormPanel(){
                return this.$parent.initFormPanel
            },
            formPanelChange(){
                if (this.$parent.formPanelChange) {
                    let $child = this.$refs.panelForm;
                    this.$parent.formPanelChange($child.formChangeData, $child.formDataLabel, $child.formChangeDataLabel);
                }

            },
            formChange(){
                if (this.$parent.formChange) {
                    this.$parent.formChange($child.formChangeData, $child.formDataLabel, $child.formChangeDataLabel);
                }
            },
            enterForm(e){
                if(e.keyCode === 13){
                    let message = this.$refs.panelForm.validate();
                    if(this.$parent){
                        let errorTip = {
                            messageTip:[],
                            validateForm:{}
                        }
                        errorTip.messageTip = message.map((item)=>{
                            return item.tip
                        });
                        errorTip.validateForm = document.querySelector(`#${message[0].colname}`);
                        this.$parent.verifyForm(errorTip);
                        this.$parent.enterClick();
                    }
                }
            }
      },
      mounted(){
          console.log(this,'343434');
          this.setFormList();
      }

};

</script>

