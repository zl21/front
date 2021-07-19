<template>
    <div>
        <Icon type="ios-arrow-forward" />
        <div class="navigator-primary-menu-div">
        {{ data.label }}
      </div> <Icon type="ios-arrow-forward" />
    </div>
</template>
<script>
 export default {
    props:{
        data:{
          type:Object
        }
    },
    mounted(){
    }
}
</script>

