<template>
  <div class="R3-api-permission">
    <div class="view-title">{{$t('messages.accountList')}}</div>

    <div class="content-area">
      <!-- 账号列表 -->
      <div class="account-list">
        <AccoutItem></AccoutItem>
        <AddAccount></AddAccount>
        <Button>{{$t('messages.addAccount')}}+</Button>
      </div>

      <!-- 接口权限 -->
      <div class="api-pannel" v-show="showPermissions">
        <ApiTree></ApiTree>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import AccoutItem from './AccoutItem'
import AddAccount from './AddAccount'
import ApiTree from './ApiTree'

export default {
  name: 'R3ApiPermission',

  components: {
    AccoutItem,
    AddAccount,
    ApiTree
  },

  data() {
    return {
      showPermissions: false,
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>