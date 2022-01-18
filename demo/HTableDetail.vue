/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="StandardTableListRootDiv">
     <div style="padding:50px 0">
       34534534534535353
        <Steps :current="2" size="small">
            <Step title="已完成"></Step>
            <Step title="进行中"></Step>
            <Step title="待进行"></Step>
            <Step title="待进行"></Step>
        </Steps>
      </div>
   <div>
      <div>哈哈哈，这个是测试啦啦啦 
        <slot name="list-buttons">
        </slot>
      </div>
   </div>
    <slot name="list-tabBar"></slot>
    <div style="display:flex">
      <div style="width:500px"> <slot name="list-form"></slot></div>
      <div>
         <Card :bordered="false">
            <p slot="title">No border title</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
      </div>
    </div>
    
    
    <slot name="list-table"></slot>
  </div>
</template>
<script>

 export default {
    inheritAttrs: false,
    data(){
        return {
            buttonshow:false,
            R3ButtonGroup:''
        }
    },
    props:{
      getVm:{
          type:Function
      },
    },
    slotTemple:{
      // 模板
      listForm:(data)=>{
        return `
            <div> <p>名称:${data.coldesc}</p><h5> 结果：</h5></div>
            `
       
      }

    },
    components:{
        
    },
    mounted(){
            console.log(this.getVm().$refs.R3listform,'====R3listform',this.getVm());

    }
}
</script>
