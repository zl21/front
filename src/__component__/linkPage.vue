<template>
  <div style="height: 100%">
    <iframe
      v-if="urlName"
      id="iframe"
      :src="urlName"
      class="urlName"
    />
  </div>
</template>

<script>
  
  export default {
    // name: 'LinkPage',
    data() {
      return {
        
      };
    },
    props: {
      urlName: {
        type: String,
        default: ''
      },
    },
   
    activated() {
      const { linkModuleId } = this.$route.params;
      this.$store.dispatch('global/updateAccessHistory', { type: 'action', id: linkModuleId });
    }
  };
</script>

<style lang="less" >
  .urlName{
    border:none;
    width: 100%;
    height:100%;
  }
  
</style>
