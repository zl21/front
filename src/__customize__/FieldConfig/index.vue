<template>
  <div>
    <Button @click="back">返回</Button>

    <arkFieldConfig></arkFieldConfig>
  </div>
</template>

<script type="text/ecmascript-6">
import RouterPush from '../../__utils__/routerback'

export default {
  name: 'r3-field-config',

  data() {
    return {
      // tableName: 'FIELDCONFIG',
      // itemId: undefined
    }
  },

  methods: {
    back() {
      // const { fullPath } = this.$route;
      // const tableName = this.$route.params.customizedModuleName
      // const tableId = this.$route.params.customizedModuleId
      // const { keepAliveModuleName } =this.$store.state.global.activeTab;
      // const url = this.$router.$R3_history[`${tableName}/${tableId}`].fullPath

      // this.$store.commit('global/tabCloseAppoint', {
      //   routeFullPath: fullPath,
      //   keepAliveModuleName,
      //   tableName
      // });

      // this.$store.commit('global/tabOpen', {
      //   back: true,
      //   url,
      //   NToUpperCase: true,
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>