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
      name:'childrenForm',
      data(){
          return {
                CollapseName:CollapseName,
                name:'childrenForm',
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
          tableName:{
             type:String, 
          }
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
                // if (this.$parent.formPanelChange) {
                //     let $child = this.$refs.panelForm;
                //  console.log($child,'====');
                //     this.$parent.formPanelChange($child.formData, $child.formDataLabel,$child.defaulDataValue);
                // }
                 if (this.$parent.formChange) {
                     let $child = this.$refs.panelForm;
                    this.$parent.formChange({},{},{},$child.formData, $child.formDataLabel,$child.defaulDataValue);
                }

            },
            formChange(){
                console.log(232323);
                if (this.$parent.formChange) {
                    let $child = this.$refs.panelForm;
                    this.$parent.formChange({},{},{},$child.formData, $child.formDataLabel,$child.defaulDataValue);
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
                        if(errorTip.messageTip.length>0){
                             errorTip.validateForm = document.querySelector(`#${message[0].colname}`);
                            this.$parent.verifyForm(errorTip);

                        }else{
                            this.$parent.enterClick();
                        }
                       
                        
                    }
                }
            }
      },
      mounted(){
          this.setFormList();
      }

};

</script>

