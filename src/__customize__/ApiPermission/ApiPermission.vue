<template>
  <div class="R3-api-permission">
    <div class="view-title">{{$t('messages.accountList')}}</div>

    <div class="content-area">
      <!-- 账号列表 -->
      <div class="account-list">
        <AccoutItem
          @manageAuthority='manageAuthority'
          @comfirmDelete="comfirmDelete"
          @comfirmRefresh="comfirmRefresh"
          :index='0'
        ></AccoutItem>
        <AccoutItem
          @manageAuthority='manageAuthority'
          @comfirmDelete="comfirmDelete"
          @comfirmRefresh="comfirmRefresh"
          :index='1'
        ></AccoutItem>
        <AddAccount
          v-if="showAddForm"
          @cancel="hideAdd"
          @save="addAccount"
        ></AddAccount>
        <Button
          v-else
          @click="showAdd"
        >{{$t('messages.addAccount')}}+</Button>
      </div>

      <!-- 接口权限 -->
      <div
        class="api-panel"
        v-if="showPermissions"
      >
        <ApiTree :permissionsIndex='currentPermissionsIndex'></ApiTree>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import network, { urlSearchParams } from '../../__utils__/network';
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
      showAddForm: false,
      currentPermissionsIndex: undefined,
    }
  },

  methods: {
    // 展示新增账号表单
    showAdd() {
      this.showAddForm = true;
    },

    // 隐藏新增账号表单
    hideAdd() {
      this.showAddForm = false;
    },

    // 新增账号
    addAccount(account) {
      this.hideAdd()
    },

    // 管理权限
    manageAuthority(index) {
      this.currentPermissionsIndex = index
      this.showPermissions = true
    },

    // 删除账号
    comfirmDelete() {
      
    },

    // 更新密钥
    comfirmRefresh() {

    },

    // 获取账号列表
    getAccountList() {
      // network.post('/p/cs/developer/find_user_list').then(res => {
      //   console.log(res)
      // })
    }
  },

  mounted() {
    this.getAccountList()
  }
}
</script>

<style lang="scss" scoped>
</style>