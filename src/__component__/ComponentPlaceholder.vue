<template>
  <div>
    未找到{{ options.componentName }}组件，请确认R3启动项的配置是否正确
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ComponentPlaceholder',

    props: {
      options: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
      
      };
    },

    methods: {
      
    }
  };
</script>

<style lang="scss" scoped>
  
</style>
