<template>
  <div id="R3tree" class="R3tree">
    <Ztree
      ref="zTree"
      :z-nodes="treeData"
      :placeholder="placeholder"
      :Notice="Notice"
      @clickTreeNode="clickTreeNode"
      @treeSearch="treeSearch"
    />
  </div>
</template>
<script>
  import Ztree from './Ztree';

  export default {
    data() {
      return {
        searchData: {},
        queryFilterData: {}, // 过滤后的查询参数
        placeholder: '',
        treeNodeID: null, // 当前点击的节点ID
        Ids: [],
        resArr: [],
        currentClickNoded: [],
        timer: null,
        inputValue: '',
        treeName: '',
        menuTreeQuery: '', // 菜单树检索的值
        oldMenuTreeObj: null, // 上一次选中的菜单节点的数据
        newMenuTreeObj: null, // 当前选中的菜单节点的数据
        Notice:'', // 提示信息
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
        handler(val) {
          this.getTreeInfo();
        }
      },
    },
    mounted() {
      this.getTreeInfo();
    },
    methods: {
      //  this.$emit('menuTreeChange', this.Ids, this.treeName, treeNodeID, flag);
      // 参数说明
      // this.Ids: 当前选中节点的ID以及全部子ID type:Array
      // this.treeName:前端配置用作/p/cs/QueryList接口查询树节点的指定参数key
      // treeNodeID：当前点击节点ID
      // flag:true:查询选中的节点，false:查询空
      checkNode() {
        // 回显
        setTimeout(() => {
          this.$refs.zTree.checkNode();
        }, 300);
      },
      clearNode() {
        // 回显
        this.$refs.zTree.treeNode = {};
        this.callMethod();
      },
      getTreeInfo() { // 获取树信息
        if (this.treeDatas !== null) {
          this.treeData = [];
          setTimeout(() => {
            this.getTreeData();
          }, 100);
        }
      },
      getTreeData() {
        // 获取数据
        this.treeDatas().then((value) => {
          // console.log('ztree-value', value)
          this.treeData = value.data;
          this.treeName = value.name;
          this.placeholder = value.placeholder;
          this.Notice  = value.Notice;
          this.query = value.query;
          this.searchData = value.searchData;
          this.checkNode();
        });
      },
      callMethod() {
        this.$refs.zTree.callMethod();
      },
      clearInputVal() {
          this.$refs.zTree.clearInputVal();
        // this.$refs.zTree.init();
      },
      callBackFunction(tdata, resData, key, value) {
        // key:要筛选的字段
        // value:当前参数
        if (Array.isArray(tdata) && tdata.length > 0) {
          tdata.forEach((v, i) => {
            if (v[value]) {
              key.push(v[value]);
            }
            const arr = [];
            this.callBackFunction(v.CHILDREN, arr, key, value);
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
        let key = 'ID';// 查询参数对应的字段
        this.queryFilterData = {};
        if (this.query && Object.keys(this.query) && Object.keys(this.query).length > 0) {
          Object.keys(this.query).reduce((arr, obj) => {
            key = obj;
            this.queryFilterData[key] = [];
            this.callBackFunction(datas, resArr, this.queryFilterData[key], this.query[obj]);
          }, {});
        } else {
          this.queryFilterData[key] = [];
          this.callBackFunction(datas, resArr, this.queryFilterData[key], key);
        }
        this.queryFilterData = Object.keys(this.queryFilterData).reduce((arr, obj) => {
          arr[obj] = `in (${this.queryFilterData[obj]})`;
          return arr;
        }, {});
        this.$emit('menuTreeChange', this.treeName, treeNodeID, flag, this.queryFilterData, this.searchData);
        // 参数说明
        // this.queryFilterData:配置多个参数字段时，会以该对象的key为key,value为需要筛选的字段，会将当前点击的节点以及全部子节点数据内的value值对应的字段过滤出，以数组的形式作为查询参数
        // this.treeName:前端配置用作/p/cs/QueryList接口查询树节点的指定参数key
        // treeNodeID：当前点击节点ID
        // flag:true:查询选中的节点，false:查询空
      }, // 左侧树点击
      treeSearch(e, flag) {
        this.$emit('treeSearch', e, flag)
      },
    }
  };
</script>
