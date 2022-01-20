<template>
  <div :class="classes">
    <slot name="v-object-button"></slot>
    <div class="verticalTableDetailContent" ref="detailContent">
      <slot name="v-object-from"></slot>
      <slot name="v-object-TabPanels"></slot>
    </div>
    
  </div>
</template>
<script>
 export default {
  name: '',
  inheritAttrs: true,
  props:{
    classes: { 
      // 当前class
      type: String,
      default: ''
    },
  },
  mounted(){
    // this.initVm(this.$parent,this).init();
    
    
  }

}
</script>
