<template>
  <div class="StandardTableListRootDiv">
    <slot name="list-buttons"></slot>
    <slot name="list-form"></slot>
    <slot name="list-defind"></slot>    
    <slot name="list-tabBar"></slot>
    <slot name="list-table"></slot>
  </div>
</template>
<script>

 export default {
  name: '',
  inheritAttrs: true,

}
</script>
