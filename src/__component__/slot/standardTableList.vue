/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="StandardTableListRootDiv">
    <slot name="list-buttons"></slot>
    <slot name="list-form"></slot>
    <slot name="list-tabBar"></slot>
    <slot name="list-table"></slot>
  </div>
</template>
<script>

 export default {
    inheritAttrs: false
}
</script>
