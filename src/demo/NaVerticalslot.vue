<template>
  <div class="NaVertical"
  >
    <div class="NaVertical-icons">
         这个是一个测试333
        <slot name="icon-tag">操作按钮切换左边面板</slot> 
    </div>
    <div>
        <slot name="nav-input">模糊查询</slot>
        <slot name="icon-Collect">收藏<slot>icon</slot></slot>
        <slot name="icon-Lately">最近点击</slot>
        <!-- 消息提示 -->
        <slot name="icon-message"></slot>
        <slot name="icon-person">人员设置</slot>
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


