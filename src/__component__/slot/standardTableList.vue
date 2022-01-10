<template>
  <div class="StandardTableListRootDiv">
    <slot name="list-buttons"></slot>
    3434343434
    <slot name="list-form"></slot>
    4343434
    <slot name="list-tabBar"></slot>
    <slot name="list-table"></slot>
  </div>
</template>
<script>

 export default {
  name: '',
  inheritAttrs: true,
   mounted(){
     let self = this;
     console.log(this);

   }
}
</script>
