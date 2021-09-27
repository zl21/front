<template>
  <div
    class="api-tree"
    :style="apiStyle"
  >
    <div class="api-header">
      <p>【{{currentAccount.name}}】{{$t('messages.managementAuthority')}}</p>
      <Button
        type="success"
        size="small"
        @click="save"
      >{{$t('buttons.save')}}</Button>
    </div>

    <div class="api-body">
      <div class="all-panel">
        <span>{{$t('messages.interfacePermissions')}}：</span>
        <Checkbox v-model="isSelectAll">{{$t('tips.all')}}</Checkbox>
        <span class="count">({{checkedTotal}}/{{total}}})</span>
      </div>

      <div class="api-panel">
        <Ztree
          ref="zTree"
          :placeholder="$t('messages.pleaseEnterContent')"
          :z-nodes="treeData"
          :treeSetting="treeSetting"
          @treeSearch="search"
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
    }
  },

  computed: {
    // 计算组件偏移量
    apiStyle() {
      return `top: ${this.permissionsIndex * 100}px;`
    }
  },

  data() {
    return {
      value: '',
      isSelectAll: true,
      treeSetting: {
        data: {
          key: {
            children: 'apiPathVoList',
            name: 'desc',
            check: 'show'
          },
          simpleData: {
            enable: true,
            idKey: 'id', // 树节点ID名称
            pIdKey: 'apiTagId', // 父节点ID名称
          },
        },
        check: {
          enable: true,
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
    search(inputValue, searchNoData) {
      this.$emit('search', {
        value: inputValue,
        isNoData: searchNoData
      })
    },

    save() {

    },

    updateNode() {
      const zTreeObj = this.$refs.zTree.zTreeObj
      var nodes = zTreeObj.getNodes()
      console.log("🚀 ~ file: ApiTree.vue ~ line 116 ~ save ~ nodes", nodes)
      nodes[1].NAME = '中国商飞 （2-3）'
      zTreeObj.updateNode(nodes[1]);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>