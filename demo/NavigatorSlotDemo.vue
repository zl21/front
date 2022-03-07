<template>
  <div>
    <!-- 展开图标和logo -->
    <slot name="left"></slot>

    <!-- 导航菜单 -->
    <slot name="middle"></slot>

    <!-- 返回 -->
    <slot name="icon-home"></slot>  

    <div class="tag right">
      <i
        class="iconfont iconbj_message badge"
      />
    </div>
    <!-- 搜索框 -->
    <slot name="nav-input"></slot>
    
    <!-- 任务图标 -->
    <slot name="icon-task"></slot>

    <!-- 个人设置 -->
    <slot name="icon-person"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang="scss" scoped>
  
</style>