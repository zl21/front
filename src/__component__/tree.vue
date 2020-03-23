<template>
  <div
    class="tree"
  >
    <Input
      placeholder="请输入角色"
      class="input"
      icon="ios-search"
      @on-change="searchInputChange"
      @on-click="searchClick"
    />
                           
    <Tree
      ref="menuTree"
      :data="treeDatas"
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
            expand: false,
            children: [
              {
                title: 'parent 1-1',
                expand: false,
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
                expand: false,
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
      searchClick(e, input) {
        function func(tdata, resData) {
          if (Array.isArray(tdata) && tdata.length > 0) {
            tdata.forEach((v, i) => {
              if (v.children && v.children.length > 0) {
                v.children.map((a) => {
                  if (a.title.search(input.currentValue) !== -1) {
                    v.expand = true;
                  }
                });
                setTimeout(() => {
                  v.children.map((d) => {
                    if (d.expand) {
                      v.expand = true;
                    }
                  });
                }, 0);
              }
              resData.push(v);
              const arr = [];
              func(v.children, arr);
              if (resData[i] && resData[i].children) {
                resData[i].children = arr;
              }
            });
          }
        }
        const resArr = [];
        func(this.treeDatas, resArr);
        console.log(111, resArr);
      },
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
