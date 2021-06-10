/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="detail-top">
   <slot name="detail-buttons"></slot>
    <div class="detail-content">
       <slot name="detail-page"></slot>
       <slot name="detail-search"></slot>
    </div>
    <slot name="detail-table"></slot>
  </div>
</template>
<script>
    
 export default {
    inheritAttrs: false
}
</script>
<style lang="less" scoped>
.detail-content {
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
   
  }
</style>

