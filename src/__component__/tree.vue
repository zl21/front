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
        treeData: [
          // {
          //   title: 'parent 1',
          //   expand: false,
          //   children: [
          //     {
          //       title: 'parent 1-1',
          //       expand: false,
          //       children: [
          //         {
          //           title: 'leaf 1-1-1'
          //         },
          //         {
          //           title: 'leaf 1-1-2'
          //         }
          //       ]
          //     },
          //     {
          //       title: 'parent 1-2',
          //       expand: false,
          //       children: [
          //         {
          //           title: 'leaf 1-2-1'
          //         },
          //         {
          //           title: 'leaf 1-2-1'
          //         }
          //       ]
          //     }
          //   ]
          // }
        ]
      };
    },
    created() {
      document.onkeydown = (e) => {
        const key = e.keyCode;
        if (key === 13) {
          this.searchClick(e, this.menuTreeQuery);
        }
      };
    },
    props: {
      treeDatas: {
        type: Function,
        default: () => {}
      },
    },
    watch: {
      treeDatas: {
        handler() {
          if (this.treeDatas !== null) {
            this.treeDatas().then((value) => {
              this.treeData = value;
            });
          }
        }
      },
    },
    mounted() {
      if (this.treeDatas !== null) {
        this.treeDatas().then((value) => {
          this.treeData = value;
        });
      }
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
        func(this.treeData, resArr);
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
