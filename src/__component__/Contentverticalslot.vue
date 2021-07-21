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
  .transferLeft{
      width: 0px;
      transition: all ease-in-out 0.5s;
    }
  .transferRight{
    width: 220px;
        transition: all ease-in-out 0.5s;
  }
</style>


