<template>
  <div class="vertical"
       style="height:100%">
       <slot name="R3-header">
           
       </slot>
       <div class="vertical-box">
          <slot name="R3-left"></slot>
          <slot name="R3-content"></slot>
       </div>
  </div>
</template>

<script>



export default {
  name: 'Contentverticalslot',
};
</script>
<style lang="less" scoped>
 .vertical{
   flex-direction: row; 
   background-color: rgb(241, 241, 241);
   display: flex;
   .vertical-box{
      overflow: hidden;
      margin: 10px;
      flex: 1 1 1px;
     .NaVertical{
       margin-bottom: 10px;
     }
     .dispalyArea{
       background-color: #fff;
       height: calc(100% - 50px);
     }
   }
 }
  .transferLeft{
      width: 0px;
      transition: all ease-in-out 0.5s;
    }
  .transferRight{
    width: 220px;
        transition: all ease-in-out 0.5s;
  }
</style>


