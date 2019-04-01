<template>
    <div>{{tabcmd}}</div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    name: 'SingleObjectButtons',
    components: {},
    watch: {},
    computed: {},
    props: {
      tabcmd: {
        type: Object,
        default: () => ({})
      },
      tabwebact: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {}
  };
</script>

<style lang="less">
</style>
