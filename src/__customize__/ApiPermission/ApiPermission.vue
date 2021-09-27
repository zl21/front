<template>
  <div class="R3-api-permission">
    <div class="view-title">{{$t('messages.accountList')}}</div>

    <div class="content-area">
      <!-- 账号列表 -->
      <div class="account-list">
        <AccoutItem
          v-for="(item, index) in accountList"
          @manageAuthority='manageAuthority'
          @comfirmDelete="comfirmDelete"
          @comfirmRefresh="comfirmRefresh"
          :itemInfo="item"
          :key="item.credentialKey"
          :index='index'
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
        <ApiTree
          :permissionsIndex='currentPermissionsIndex'
          :currentAccount="currentAccount"
          :checkedTotal="checkedTotal"
          :total="total"
          :treeData="treeData"
          @search="searchAuthority"
        ></ApiTree>
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
      accountList: [],
      currentAccount: undefined,
      checkedTotal: 0,
      total: 0,
      treeData: []
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

    // 校验账号是否合法
    validateAccount(name) {
      return new Promise((resolve, reject) => {
        network.post('/p/cs/developer/check_user_name', { name }).then(res => {
          if (res.data.code === 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch(() => {
          resolve(false)
        })
      })
    },

    // 新增账号
    async addAccount(name) {
      if (await this.validateAccount(name)) {
        network.post('/p/cs/developer/save_user', { name }).then(res => {
          if (res.data.code === 0) {
            this.getAccountList()
            this.hideAdd()
          }
        })
      }
    },

    // 删除账号
    comfirmDelete({ id }) {
      network.post('/p/cs/developer/delete_user', { id }).then(res => {
        if (res.data.code === 0) {
          this.getAccountList()
          this.$Message.success(this.$t('feedback.deleteSuccessfully'));
        }
      })
    },

    // 更新密钥
    comfirmRefresh({ id }) {
      network.post('/p/cs/developer/flush_secret', { id }).then(res => {
        if (res.data.code === 0) {
          this.getAccountList()
          this.$Message.success(this.$t('feedback.refreshSuccess'));
        }
      })
    },

    // 获取账号列表
    getAccountList() {
      // this.$R3loading.show(this.loadingName);
      network.post('/p/cs/developer/find_user_list', {}).then(res => {
        if (res.data.code === 0) {
          this.accountList = res.data.data.list
        }
      }).finally(() => {
        // this.$R3loading.hide(this.loadingName);
      })
    },

    // 查询用户权限
    manageAuthority(info) {
      this.currentPermissionsIndex = info.index
      this.currentAccount = info.item
      this.showPermissions = true

      network.post('/p/cs/developer/find_permission_list', { apiUserId: this.currentAccount.id }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.checkedTotal = data.showTotal
          this.total = data.total
          this.treeData = this._formatTree(data.list)
          console.log("🚀 ~ this.treeData", this.treeData)
        }
      })
    },

    // 模糊搜索权限
    searchAuthority(params) {
      network.post('/p/cs/developer/find_permission_list', { apiUserId: this.currentAccount.id, name: params.value }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.checkedTotal = data.showTotal
          this.total = data.total
          this.treeData =  this._formatTree(data.list)
        }
      })
    },

    // 重组权限树的数据
    _formatTree(data) {
      data.forEach(parentObj => {
        parentObj.desc = `${parentObj.apiTagDesc} (${parentObj.showTotal}/${parentObj.total})`
        parentObj.apiPathVoList.forEach(childObj => {
          childObj.desc = `${childObj.name}    ${childObj.path}`
        })
      })
      return data
    }
  },

    // created() {
    //     this.loadingName = this.$route.meta.moduleName.replace(/\./g, '-');
    //   },

    mounted() {
      this.getAccountList()
    }
  }
</script>

<style lang="scss" scoped>
</style>