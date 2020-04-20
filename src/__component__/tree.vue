<template>
  <div
    class="tree"
  >
    <Input
      v-model="inputValue"
      :placeholder="getPlaceholder"
      class="input"
      icon="ios-search"
      @on-change="searchInputChange"
      @on-click="searchClick"
      @on-enter="searchClick"
    />
                           
    <Tree
      ref="menuTree"
      class="treeContent"
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
        placeholder: '',
        inputValue: '',
        treeName: '',
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
    computed: {
      getPlaceholder() {
        if (this.placeholder) {
          return this.placeholder;
        }
        return `请输入${this.currentLabel}`;
      }
    },
    created() {
      // document.onkeydown = (e) => {
      //   const key = e.keyCode;
      //   if (key === 13) {
      //     this.searchClick(e, this.menuTreeQuery);
      //   }
      // };
    },
    props: {
      currentLabel: {
        type: String,
        default: ''
      }, 
      treeDatas: {
        type: Function,
        default: () => {}
      },     
      isChangeTreeConfigData: {
        type: String,
        default: ''
      }, 
    
    },
    watch: {
      treeDatas: {
        handler() {
          if (this.treeDatas !== null) {
            this.treeDatas().then((value) => {
              this.treeData = value.data;
              this.treeName = value.name;
              this.placeholder = value.placeholder;
            });
          }
        }
      },
      isChangeTreeConfigData: {
        handler(val) {
          function func(tdata, resData) {
            if (Array.isArray(tdata) && tdata.length > 0) {
              tdata.forEach((v, i) => {
                if (v.selected) {
                  v.selected = false;
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
          if (val === 'Y') {
            this.menuTreeQuery = '';
            this.inputValue = '';
            const resArr = [];
            func(this.treeData, resArr);
            this.$emit('changeTreeConfigData', '');
          }
        }
      },
    },
    mounted() {
      if (this.treeDatas !== null) {
        this.treeDatas().then((value) => {
          this.treeData = value.data;
          this.treeName = value.name;
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
                    console.log(2, v.title, a.title, input.currentValue);
                  }
                });
                setTimeout(() => {
                  v.children.map((d) => {
                    if (d.expand) {
                      console.log(1, d.title);
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
        const arrayIDs = [];
        function func(tdata, resData) {
          if (Array.isArray(tdata) && tdata.length > 0) {
            tdata.forEach((v, i) => {
              resData.push(v);
              if (v.ID) {
                arrayIDs.push(JSON.stringify(v.ID));
              }
              const arr = [];
              func(v.children, arr);
              if (resData[i] && resData[i].children) {
                resData[i].children = arr;
              }
            });
          }
        }
        const resArr = [];
        func(val, resArr);
        this.$emit('menuTreeChange', arrayIDs, this.treeName, val, item);
      }, // 左侧树点击
    }
  };
</script>
<style >
.ark-tree-title-selected{
  background:red !important;
}
.treeContent{
  overflow: scroll;
    width: 100%;
    height: 100%;
}
.input{
  margin-bottom:10px
}
</style>
