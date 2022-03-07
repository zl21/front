<template>
    <div>
        <Button  type="primary" icon="ios-search">{{slotProps.item.name}}</Button>
      </div>
</template>
<script>
 export default {
    props:{
        slotProps:{   // 用来接收子表的按钮数据
          type:Object
        }
    }
}
</script>
<style lang="less">
 .detail-buttons {
     a{
        display: inline-block;
        padding: 8px 10px;
    }
 }
</style>