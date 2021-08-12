<template>
    <div>
        <Button  type="primary" size="small" @click="buttonClick">
              查找
        </Button>
        <Button  type="primary" size="small"  @click="buttonClick('reset')">
              重置
        </Button>
         <Button  type="primary" size="small" @click="iconClick">
              收拉折叠框
        </Button>
        <!-- {{slotProps.item.name}} -->
      </div>
</template>
<script>
 export default {
    props:{
      ButttonCallBack:{
         type: Function,
         default: ()=>{
          //  点击事件回调
         }
      },
      IconCallBack:{
         type: Function,
         default: ()=>{
          //  收拉回调
           
         }
      }
       
    },
    data(){
      return {
        hiddenButtons:['reset','search'],
        hiddenIcon:false, // 是否隐藏收拉icon
      }
    },
    methods:{
      buttonClick(type){
        this.ButttonCallBack(type);
      },
      iconClick(){
        this.IconCallBack()
      }

    }
}
</script>
