<template>
    <div>
        <Button>{{slotProps.item.name}}</Button>
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
