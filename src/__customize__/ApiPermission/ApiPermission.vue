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
          ref="apiTree"
          :permissionsIndex='currentPermissionsIndex'
          :currentAccount="currentAccount"
          :checkedTotal="checkedTotal"
          :total="total"
          :treeData="treeData"
          :isUpdated="isUpdated"
          @search="searchAuthority"
          @updateCheckedCount="updateCheckedCount"
          @check="handlerNodeCheck"
          @save="saveAuthority"
          @refresh="refreshAuthority"
          @updateStatus="updateStatus"
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
      treeData: [],
      isUpdated: false, // 是否修改过数据
      searchCache: '' // 缓存查询结果
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
          this.showPermissions = false
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
      this._clearData()

      network.post('/p/cs/developer/find_permission_list', { apiUserId: this.currentAccount.id }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.treeData = this._formatTree(data.list)
          this.checkedTotal = data.showTotal
          this.total = data.total
        }
      })
    },

    // 模糊搜索权限
    searchAuthority({ value, zTreeObj, isExpandAll }) {
      this.searchCache = value
      network.post('/p/cs/developer/find_permission_list', { apiUserId: this.currentAccount.id, name: value }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.checkedTotal = data.showTotal
          this.total = data.total
          this.treeData = this._formatTree(data.list)
          this.isUpdated = false
          if (isExpandAll) {
            setTimeout(() => {
              zTreeObj.expandAll(true)
            }, 100)
          }
        }
      })
    },

    // 更新勾选节点数量
    updateCheckedCount(num) {
      this.checkedTotal = num
    },

    // 获取之前勾选的值
    async _getHistoryChecked() {
      const res = await network.post('/p/cs/developer/find_permission_list', { apiUserId: this.currentAccount.id })
      const checkedDataCache = []
      if (res.data.code === 0) {
        const data = res.data.data
        const treeData = this._formatTree(data.list)

        // 缓存已经勾选的数据
        treeData.forEach(pNode => {
          if (pNode.show) {
            checkedDataCache.push({
              apiPathId: pNode.id,
              apiTagId: pNode.tagId,
              apiUserId: this.currentAccount.id
            })
          }
          pNode.apiPathVoList.forEach(node => {
            if (node.show) {
              checkedDataCache.push({
                apiPathId: node.id,
                apiTagId: node.tagId,
                apiUserId: this.currentAccount.id
              })
            }
          })
        })
      }
      return checkedDataCache
    },

    // 获取最终的勾选结果
    async _getRealChecked(zTreeObj) {
      const historyCheckedNodes = await this._getHistoryChecked()

      // 获取所有有状态变化的节点
      const updatedNodes = zTreeObj.getChangeCheckedNodes();

      // 对比接口全部节点，是否有新增节点和取消勾选的节点
      const newNodes = [] // 收集新增的节点
      updatedNodes.forEach(node => {
        // 如果是新增的节点，判断是否在  历史勾选的节点中
        // 不在的话就往历史勾选的节点中添加
        if (node.show) {
          let isExist = false // 标记是否存在相同节点
          for (let i = 0; i < historyCheckedNodes.length; i++) {
            const historyNode = historyCheckedNodes[i]
            if (node.id === historyNode.apiPathId && node.tagId === historyNode.apiTagId) {
              isExist = true
              return
            }
          }
          if (!isExist) {
            newNodes.push({
              apiPathId: node.id,
              apiTagId: node.tagId,
              apiUserId: this.currentAccount.id
            })
          }
        } else {
          // 如果是取消的节点
          // 就把历史勾选的节点中 对应的节点给删除
          for (let i = 0; i < historyCheckedNodes.length; i++) {
            const historyNode = historyCheckedNodes[i]
            if (node.id === historyNode.apiPathId && node.tagId === historyNode.apiTagId) {
              // 如果被取消的是父节点, 则历史节点中，父节点的子节点全部删除(即同组节点)，父节点也删除
              if (node.isParent) {
                historyCheckedNodes.splice(i, 1)
                node.apiPathVoList.forEach(item => {
                  for (let j = 0; j < historyCheckedNodes.length; j++) {
                    const oldNode = historyCheckedNodes[j]
                    if (item.tagId === oldNode.apiTagId) {
                      historyCheckedNodes.splice(j, 1)
                      return
                    }
                  }
                })
              } else {
                // 如果被取消的节点是子节点，直接删除
                historyCheckedNodes.splice(i, 1)
              }

              return
            }
          }
        }
      })

      const realCheckedNodes = [...historyCheckedNodes, ...newNodes]
      return realCheckedNodes
    },

    // 保存权限
    async saveAuthority(zTreeObj) {
      // 场景: 存在已经勾选的节点，然后模糊搜索再进行勾选。此时应该取并集（注意去重）
      const realCheckedNodes = await this._getRealChecked(zTreeObj)
      network.post('/p/cs/developer/update_permission', { apiUserId: this.currentAccount.id, list: realCheckedNodes }).then(res => {
        if (res.data.code === 0) {
          this.isUpdated = false
          // 刷新数据。这样树才能检查新的节点变化
          this.updateAuthorityData(zTreeObj)

          this.$Message.success(this.$t('feedback.saveSuccess'));
        }
      })
    },

    // 刷新权限数据(保持展开状态)
    updateAuthorityData(zTreeObj) {
      const allNodes = zTreeObj.getNodes()
      // 计算出之前展开的节点id
      const openList = allNodes.filter(node => node.open).map(node => {
        return node.tagId
      })
      network.post('/p/cs/developer/find_permission_list', { apiUserId: this.currentAccount.id, name: this.searchCache }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.checkedTotal = data.showTotal
          this.total = data.total
          const treeData = this._formatTree(data.list)
          treeData.forEach(node => {
            if (openList.includes(node.apiTagId)) {
              node.open = true
            }
          })
          this.treeData = treeData
        }
      })
    },

    // 清空数据
    _clearData() {
      if (this.$refs.apiTree) {
        this.$refs.apiTree.$refs.zTree.inputValue = '' // 清空输入框的值
      }
      this.searchCache = '' // 清空输入框的值
      this.isUpdated = false // 重置数据变更状态
    },

    // 刷新权限
    refreshAuthority() {
      this._clearData()
      network.post('/p/cs/developer/flush_permission').then(res => {
        if (res.data.code === 0) {

          this.manageAuthority({
            index: this.currentPermissionsIndex,
            item: this.currentAccount
          })
          this.$Message.success(this.$t('feedback.refreshSuccess'));
        }
      })
    },

    // 全选/反选时,检查数据是否更新
    updateStatus(value) {
      this.isUpdated = value
    },

    // 计算已勾选节点树(排除父节点)
    _getCheckedCount(zTreeObj) {
      const checkedNodes = zTreeObj.getCheckedNodes(true)
      const realCheckedNodes = checkedNodes.filter(item => {
        return item.isParent === false
      })
      this.checkedTotal = realCheckedNodes.length
    },

    // 判断是否修改过数据
    _checkNode(zTreeObj) {
      this.isUpdated = false // 判断是否修改过数据
      const checkedNodes = zTreeObj.getChangeCheckedNodes()
      if (checkedNodes.length > 0) {
        this.isUpdated = true // 判断是否修改过数据
      }
    },

    // 更新父节点统计数
    _updateNodeCount(treeNode, zTreeObj) {
      if (treeNode.isParent) {
        const checkedNodes = treeNode.apiPathVoList.filter(item => item.show)
        treeNode.desc = `${treeNode.apiTagDesc} (${checkedNodes.length}/${treeNode.apiPathVoList.length})`
        zTreeObj.updateNode(treeNode)
      } else {
        const parentNode = zTreeObj.getNodeByTId(treeNode.parentTId)
        const checkedNodes = parentNode.apiPathVoList.filter(item => item.show)
        parentNode.desc = `${parentNode.apiTagDesc} (${checkedNodes.length}/${parentNode.apiPathVoList.length})`
        zTreeObj.updateNode(parentNode)
      }
    },

    // 监听树节点勾选
    handlerNodeCheck({ e, treeId, treeNode, zTreeObj }) {
      this._getCheckedCount(zTreeObj)
      this._updateNodeCount(treeNode, zTreeObj)
      this._checkNode(zTreeObj)
    },

    // 重组权限树的数据
    _formatTree(data) {
      data.forEach(parentObj => {
        parentObj.desc = `${parentObj.apiTagDesc} (${parentObj.showTotal}/${parentObj.total})`
        parentObj.tagId = parentObj.apiTagId
        parentObj.apiPathVoList.forEach(childObj => {
          childObj.desc = `${childObj.name}    ${childObj.path}`
          childObj.tagId = childObj.apiTagId
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