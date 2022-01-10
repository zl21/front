<template>
  <div class="NaVertical"
  >
    <div class="NaVertical-icons">
        <slot name="icon-tag"></slot> 
    </div>
    <div class="NaVertical-box">
        <slot name="nav-input"></slot>
        <slot name="icon-home"></slot>
        <slot name="icon-Collect"></slot>
        <slot name="icon-Lately"></slot>
        <slot name="icon-Setting"></slot>
        <!-- 消息提示 -->
        <slot name="icon-message"></slot>
        <slot name="icon-task"></slot>
        <slot name="icon-person"></slot>
    </div>
  </div>
</template>
<script>

export default {
  name:'NaVerticalslot'
}
</script>
<style lang="scss">
.NavigatorVertical.transferLeft{
    width: 0px;
    transition: all ease-in-out 0.5s;
  }
  .NavigatorVertical.transferRight{
    width: 220px;
    transition: all ease-in-out 0.5s;
  }
</style>


