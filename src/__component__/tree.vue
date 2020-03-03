<template>
  <div
    class="tree"
  >
    <Input
      placeholder="请输入角色"
      class="input"
      clearable
      icon="ios-search"
      @on-change="searchInputChange"
    />
                           
    <Tree
      ref="menuTree"
      :data="treeData"
      :query="menuTreeQuery"
      @on-select-change="menuTreeChange"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        menuTreeQuery: '', // 菜单树检索的值
        oldMenuTreeObj: null, // 上一次选中的菜单节点的数据
        newMenuTreeObj: null, // 当前选中的菜单节点的数据
        treeDatas: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ]
      };
    },
    props: {
      treeData: {
        type: Array,
        default: () => ([])
      },
    },
    mounted() {
    },
    methods: {
      searchInputChange(e) {
        this.menuTreeQuery = e.target.value;
      }, // 检索输入框值改变
      menuTreeChange(val, item) {
        this.$emit('menuTreeChange', val, item);
      }, // 左侧树点击
    }
  };
</script>
<style scoped>

.input{
  margin-bottom:10px
}
</style>
