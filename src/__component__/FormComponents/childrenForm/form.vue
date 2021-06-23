<template>
<div>
    23232323
     <panelForm
       v-bind="$attrs"
      :defaultData="formList"
    ></panelForm>
</div>
</template>
<script>
export default {
      name:'childrenForm',
      data(){
          return {
                formList: {
                    defaultData:{
                        addcolums:[],
                        objviewcol:4
                    }
                },  //控制面板的展开数据
            }

      },
      props:{
          defaultData: {  //表单数据
            type: [Array, Object]
          },
      },
      methods:{
          setFormList(){
              this.formList.defaultData.addcolums = this.defaultData.inpubobj.concat([]);
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
      mounted(){
          this.setFormList();
      }

};

</script>

