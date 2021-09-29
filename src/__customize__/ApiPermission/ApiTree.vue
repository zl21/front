<template>
  <div
    class="api-tree"
    :style="apiStyle"
  >
    <div class="api-header">
      <p>【{{currentAccount.name}}】{{$t('messages.managementAuthority')}} <span
          class="refresh"
          @click="refresh"
        >
          <img
            src="../../assets/image/refresh.png"
            class="refresh-icon"
            alt=""
          >
        </span></p>
      <Button
        type="success"
        size="small"
        :class="[isUpdated ? '': 'disabled']"
        @click="save"
      >{{$t('buttons.save')}}</Button>
    </div>

    <div class="api-body">
      <div class="all-panel">
        <span>{{$t('messages.interfacePermissions')}}：</span>
        <Checkbox v-model="isSelectAll">{{$t('tips.all')}}</Checkbox>
        <span class="count">({{checkedTotal}}/{{total}})</span>
      </div>

      <div class="api-panel">
        <Ztree
          ref="zTree"
          :placeholder="$t('messages.pleaseEnterContent')"
          :z-nodes="treeData"
          :treeSetting="treeSetting"
          :customizedSearch="search"
        ></Ztree>
      </div>
    </div>
    <i class="iconfont arrow-r">&#xea18;</i>
  </div>
</template>

<script type="text/ecmascript-6">
import Ztree from '../../__component__/Ztree.vue'

export default {
  name: 'R3ApiTree',

  components: {
    Ztree
  },

  props: {
    // 第几个权限的索引
    permissionsIndex: {
      type: Number,
      default: 0
    },
    // 当前账号信息
    currentAccount: {
      type: Object,
    },
    // 已勾选的权限总数
    checkedTotal: {
      type: Number,
    },
    // 权限总数
    total: {
      type: Number,
    },
    // 树数据
    treeData: {
      type: Array
    },
    // 是否修改过数据
    isUpdated: {
      type: Boolean
    }
  },

  computed: {
    // 计算组件偏移量
    apiStyle() {
      return `top: ${this.permissionsIndex * 100}px;`
    }
  },

  watch: {
    // 根据勾选数量，计算【全部】checkbox是否要被勾选
    checkedTotal: {
      handler(checkedCount) {
        if (checkedCount === this.total && this.total !== 0) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
        }
      },
      immediate: true
    },

    // 主动全选、反选
    isSelectAll(newVal) {
      console.log("🚀 ~ file: ApiTree.vue ~ line 106 ~ isSelectAll ~ newVal", newVal)
      const zTreeObj = this.$refs.zTree.zTreeObj

      // 主动点击全选
      if (newVal && this.checkedTotal !== this.total) {
        this.$emit('updateCheckedCount', this.total)
        zTreeObj.checkAllNodes(true)
        console.log('全选');
        // 重命名父节点
        this._updateNodeCount(zTreeObj)
      }
      // 主动点击反选
      if (!newVal && this.checkedTotal === this.total) {
        this.$emit('updateCheckedCount', 0)
        zTreeObj.checkAllNodes(false)
        console.log('反选');

        // 重命名父节点
        this._updateNodeCount(zTreeObj)
      }
      // 检查是否更新数据
      this._checkNode(zTreeObj)
    }, 

    // 切换权限后，清理数据
    permissionsIndex() {
      this.$refs.zTree.inputValue = '' // 清空输入框的值
    }
  },

  data() {
    return {
      value: '',
      isSelectAll: false,
      treeSetting: {
        data: {
          key: {
            children: 'apiPathVoList',
            name: 'desc',
            checked: 'show'
          },
          simpleData: {
            enable: true,
            idKey: 'id', // 树节点ID名称
            pIdKey: 'apiTagId', // 父节点ID名称
          },
        },
        callback: {
          onCheck: this.handleCheck
        },
        check: {
          enable: true,
        },
        view: {
          selectedMulti: false,
          showIcon: false,
          nameIsHTML: true,
          dblClickExpand: true,
        },
      },
      // treeData: [
      //   {
      //     "desc": "WSZZ01",
      //     "apiTagId": null,
      //   },
      //   {
      //     "apiPathVoList": [
      //       {
      //         "desc": "中国商用飞机有限责任公司",
      //         "id": "1",
      //       },
      //       {
      //         "desc": "公司领导",
      //         "id": "10",
      //       }
      //     ],
      //     "desc": "中国商飞",
      //     "apiTagId": null,
      //   },
      // ]
    }
  },

  methods: {
    // 查询节点
    search(value, zTreeObj) {
      this.$emit('search', { value, zTreeObj, isExpandAll: true })
    },

    save() {
      if (this.isUpdated) {
        this.$emit('save', this.$refs.zTree.zTreeObj)
      }
    },

    // 刷新权限
    refresh() {
      this.$emit('refresh')
    },

    // 点击树节点
    handleCheck(e, treeId, treeNode) {
      const zTreeObj = this.$refs.zTree.zTreeObj
      this.$emit('check', {
        e, treeId, treeNode, zTreeObj
      })
    },

    // 更新父节点统计数
    _updateNodeCount(zTreeObj) {
      const nodes = zTreeObj.getNodes()
      nodes.forEach(node => {
        const checkedNodes = node.apiPathVoList.filter(item => item.show)
        node.desc = `${node.apiTagDesc} (${checkedNodes.length}/${node.apiPathVoList.length})`
        zTreeObj.updateNode(node)
      })
    },

    // 检查是否更新了数据
    _checkNode(zTreeObj) {
      let isUpdated = false // 判断是否修改过数据
      const checkedNodes = zTreeObj.getChangeCheckedNodes()
      console.log("🚀 ~ file: ApiTree.vue ~ line 222 ~ _checkNode ~ checkedNodes", checkedNodes)
      if (checkedNodes.length > 0) {
        isUpdated = true // 判断是否修改过数据
      }
      this.$emit('updateStatus', isUpdated)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>