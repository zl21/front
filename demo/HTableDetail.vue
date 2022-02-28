<template>
  <div :class="classes">
    2222222
    <slot name="v-object-button"></slot>
    werwer
    <slot name="v-object-Content">
      23535434
      <slot name="v-object-from"></slot>
      <slot name="v-object-TabPanels"></slot>
    </slot>
    
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
    
    
  }

}
</script>
