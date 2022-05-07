<template>
    <div>
        <Icon type="ios-arrow-forward" />
        <div class="navigator-primary-menu-div">
        {{ data.label }}
      </div>
    </div>
</template>
<script>
 export default {
    data(){
      return {
        icons:{
          '主数据中心':'',
          '零售中心':'',
          '营销中心':'',
          '会员中心':'',
          '终端管理':'',
          '运维平台':'',
          '系统配置':''
        }
      }
    },
    props:{
        data:{
          type:Object
        }
    },
    mounted(){
    }
}
</script>
<style scoped>
.ark-icon{
  margin-right: 10px;
}
</style>

