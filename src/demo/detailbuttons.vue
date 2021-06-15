<template>
    <div>
        <Button  type="primary">{{slotProps.item.name}}</Button>
      </div>
</template>
<script>
 export default {
    props:{
        slotProps:{
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
