<template>
  <div class="api-tree">
    <div class="api-header">
      <p>【xxx】{{$t('messages.managementAuthority')}}</p>
      <Button
        type="success"
        size="small"
        @click="save"
      >{{$t('buttons.save')}}</Button>
    </div>

    <div class="api-body">
      <div class="all-pannel">
        <span>{{$t('messages.interfacePermissions')}}：</span>
        <Checkbox v-model="isSelectAll">{{$t('tips.all')}}</Checkbox>
        <span class="count">(38/38)</span>
      </div>

      <div class="api-pannel">
        <Ztree
          ref="zTree"
          :placeholder="$t('messages.pleaseEnterContent')"
          :z-nodes="treeData"
          :treeSetting="treeSetting"
          @treeSearch="search"
        ></Ztree>
      </div>

      <!-- <div class="search-pannel">
        <Input
          v-model="value"
          :placeholder="$t('messages.pleaseEnterContent')"
          suffix="ios-search"
        ></Input>
      </div>

      <div class="api-pannel">

      </div> -->

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Ztree from '../../__component__/Ztree.vue'

export default {
  name: 'R3ApiTree',

  components: {
    Ztree
  },

  data() {
    return {
      value: '',
      isSelectAll: true,
      treeSetting: {
        check: {
          enable: true
        }
      },
      treeData: [
        {
          "ID": 2481,
          "NAME": "WSZZ01",
          "PARENT_ID": null,
        },
        {
          "CHILDREN": [
            {
              "CHILDREN": [],
              "NAME": "中国商用飞机有限责任公司",
              "PARENT_ID": "1",
            },
            {
              "CHILDREN": [],
              "NAME": "公司领导",
              "PARENT_ID": "10",
            }
          ],
          "NAME": "中国商飞",
          "PARENT_ID": null,
        },
        {
          "CHILDREN": [
            {
              "CHILDREN": [],
              "NAME": "阿萨",
              "PARENT_ID": "1",
            },
            {
              "CHILDREN": [],
              "NAME": "欣赏欣赏",
              "PARENT_ID": "10",
            }
          ],
          "NAME": "欣赏欣赏",
          "PARENT_ID": null,
        }
      ]
    }
  },

  methods: {
    // 查询节点
    search(inputValue, searchNoData) {
      console.log('查询', inputValue, searchNoData)
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