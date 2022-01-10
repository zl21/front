/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="StandardTableListRootDiv">
   <div>
      <p>哈哈哈，这个是测试啦啦啦</p>
      <slot name="list-buttons"></slot>
       <R3ButtonGroup/>
   </div>
    <slot name="list-tabBar"></slot>
    <slot name="list-form"></slot>
    
    <slot name="list-table"></slot>
  </div>
</template>
<script>

 export default {
    inheritAttrs: false,
    components:{
        //  R3ButtonGroup:this.$parent.$refs.R3ButtonGroup
    },
    created(){
      console.log(this.$parent.$refs.R3ButtonGroup)
    }
}
</script>
