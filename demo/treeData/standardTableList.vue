/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div class="StandardTableListRootDiv">
    <slot name="list-buttons"></slot>
    <slot name="list-tabBar"></slot>
    <slot name="list-form"></slot>
    <div>哈哈哈，这个是测试啦啦啦</div>
    <slot name="list-table"></slot>
  </div>
</template>
<script>

 export default {
    inheritAttrs: false
}
</script>
