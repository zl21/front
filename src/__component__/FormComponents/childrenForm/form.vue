<template>
<div>
     <panelForm
      v-bind="$attrs"
      :CollapseName="CollapseName"
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
      methods:{
          setFormList(){
              this.formList.addcolums[0].childs = this.defaultData.inpubobj.concat([])
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

