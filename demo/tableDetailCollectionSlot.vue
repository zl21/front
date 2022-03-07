/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="detail-top">
   <slot name="detail-buttons"></slot>
    <div class="detail-content">
       <slot name="detail-search"></slot>
    </div>
    全局一对多子表
    <!-- <slot name="detail-table"></slot> -->
    <slot name="detail-page"></slot>
  </div>
</template>
<script>

 export default {
    inheritAttrs: false,
    data(){
      return {
        valueHalf:2.5,
      }
    },
    mounted(){
      console.log(this.$attrs,'=====子======');
    }
}
</script>
