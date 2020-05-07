<template>
  <div
    id="R3tree"
    class="R3tree"
  >
    <Ztree
      ref="zTree"
      :z-nodes="treeData"
      @clickTreeNode="clickTreeNode"
    />
  </div>
</template>
<script>
  import Ztree from './Ztree';

  export default {
    data() {
      return {
        treeNodeID: null, // 当前点击的节点ID
        Ids: [],
        resArr: [],
        currentClickNoded: [],
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
    components: {
      Ztree
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
              this.treeData = value.data;
              this.treeName = value.name;
            });
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
      //  this.$emit('menuTreeChange', this.Ids, this.treeName, treeNodeID, flag);
      // 参数说明
      // this.Ids: 当前选中节点的ID以及全部子ID type:Array
      // this.treeName:前端配置用作/p/cs/QueryList接口查询树节点的指定参数key
      // treeNodeID：当前点击节点ID
      // flag:true:查询选中的节点，false:查询空


      callMethod() {
        this.$refs.zTree.callMethod(); 
      },
      callBackFunction(tdata, resData) {
        if (Array.isArray(tdata) && tdata.length > 0) {
          tdata.forEach((v, i) => {
            if (v.ID) {
              this.Ids.push(v.ID);
            }
            const arr = [];
            this.callBackFunction(v.CHILDREN, arr);
            if (resData[i] && resData[i].CHILDREN) {
              resData[i].CHILDREN = arr;
            }
          });
        }
      },
      clickTreeNode(datas, treeNodeID, flag) {      
        if (flag) { // 为true时查询当前节点以及全部子节点
          this.currentClickNoded = datas;
          this.treeNodeID = treeNodeID;
          this.menuTreeChange(datas, treeNodeID, flag);
        } else { // 查空
          this.menuTreeChange(datas, treeNodeID, flag);
        }
      },
      searchInputChange(e) {
        this.menuTreeQuery = e.target.value;
      }, // 检索输入框值改变
  
      menuTreeChange(datas, treeNodeID, flag) {
        const resArr = [];
        this.Ids = [];// 需将上一次查询存储的ID置空
        this.callBackFunction(datas, resArr);
        this.$emit('menuTreeChange', this.Ids, this.treeName, treeNodeID, flag);
        // 参数说明
        // this.Ids: 当前选中节点的ID以及全部子ID type:Array
        // this.treeName:前端配置用作/p/cs/QueryList接口查询树节点的指定参数key
        // treeNodeID：当前点击节点ID
        // flag:true:查询选中的节点，false:查询空
      }, // 左侧树点击
    }
  };
</script>
<style >
.R3tree{
    width:300px;
    padding:10px;
    border-right:1px solid #d2d2d2;
    overflow-x: scroll;
    overflow-y: scroll;
   
  }
.input{
  margin-bottom:10px
}
</style>
