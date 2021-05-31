<template>
  <div class="content_wrap">
    <Input
      id="key"
      v-model="inputValue"
      :placeholder="placeholder"
      class="input"
      icon="ios-search"
      @on-click="search"
      @on-change="change"
      @on-enter="search"
    />
    <p class="orange" v-if="showTip && inputValue.length>0">"{{inputValue}}"{{Notice}}</p>
    <!-- <p>
      关键字：<input
        id="key"
        type="text"
        value=""
        class="empty"
        placeholder="请输入关键字"
      ><br>
    </p>
    <Button
      
      type="posdefault"
      @click="search"
    >
      查询
    </Button> -->
    <div class="zTreeDemoBackground left">
      <ul
        :id="tableName"
        class="ztree"
      />
    </div>
  </div>
</template>

<script>
  import { fuzzySearch } from '../../static/js/ztree/fuzzysearch';

  export default {
    name: 'ZTree',
    data() {
      return {
        inputValue: '',
        tableName: 'treeDemo',
        showTip:false,
        setting: {
          check: {
            enable: false// checkbox
          },
          view: {
            selectedMulti: false,
            showIcon: false,
            nameIsHTML: true,
            dblClickExpand: false,
            // showLine: false,
            // fontCss: this.setFontCss
          },
          callback: {
            beforeClick: this.beforeClick,
            onClick: this.onClick
          },
          edit: {
            enable: false,
            editNameSelectAll: false
          },
          data: {
            key: {
              children: 'CHILDREN',
              name: 'NAME',
            },
            simpleData: {
              enable: true,
              idKey: 'ID', // 树节点ID名称
              pIdKey: 'PARENT_ID', // 父节点ID名称
            // rootPId: -1,//根节点ID
            }
          },
        },
        isClick: false,
        treeId: ''

        
      };
    },
    watch: {
      zNodes: {
        handler() {
          $.fn.zTree.init($(`#${this.tableName}`), this.setting, this.zNodes);
        },
        deep: true
      },
      // isChangeTreeConfigData: {
      //   handler(val) {
      //     debugger;

      //     if (val === 'Y') {
      //       this.inputValue = '';
      //       this.search();
           
      //       // this.$emit('changeTreeConfigData', '');
      //     }
      //   }
      // },
    },
   
    props: {
      // isChangeTreeConfigData: {
      //   type: String,
      //   default: ''
      // }, 
      placeholder: {// 设置查询框placeholder
        type: String,
        default: () => '请输入角色'
      },
      Notice:{
        type: String,
        default: () => '匹配失败，请重新输入'
      },
      treeDatas: {
        type: Function,
        default: () => {}
      },     
      zNodes: {
        type: Array,
        default: () => []
      }, 
    },
    methods: {

      // this.$emit('clickTreeNode', arr, treeNode.ID, true);
      // arr:当前点击的节点以及全部子节点
      // treeNode.ID:当前点击节点ID
      // 第三个参数为true:需查询当前点击节点以及全部子节点，为false:查空值


      // setFontCss(treeId, treeNode) {
      //   return { color: 'red' };
      // },
      // hasClass(element, cls) { // 判断当前节点是否包含需要添加的class
      //   return (` ${element.className} `).indexOf(` ${cls} `) > -1;
      // },
      // beforeClick(treeId, treeNode, clickFlag) {
      //   if (this.treeId === treeNode.tId) {
      //     const treeObj = $.fn.zTree.getZTreeObj('treeDemo');
      //     const nodes = treeObj.getNodes();
      //     if (nodes.length > 0) {
      //       nodes[0].name = '夏';
      //       nodes[0].isHover = false;

      //       console.log(111, nodes[0].name, nodes[0].isHover);

      //       treeObj.updateNode(nodes[0]);
      //     }
      //   }
      //   this.treeId = treeNode.tId;

      //   return true;
      // },
      checkNode() { 
        // 选中
        const treeObj = $.fn.zTree.getZTreeObj(`${this.tableName}`);
        if (JSON.stringify(this.treeNode) !== '{}' && this.treeNode) {
          const node = treeObj.getNodeByTId(this.treeNode.tId);   
          if (node) {
            treeObj.selectNode(node);
          }
        } else if (treeObj) {
          treeObj.refresh();
        } 
      },
      onClick(e, treeId, treeNode) {
        const arr = [];
        this.treeNode = treeNode;
        if (this.treeId === treeNode.tId) {
          this.isClick = !this.isClick;
          if (this.isClick) { // 取消选中查空
            const treeObj = $.fn.zTree.getZTreeObj(`${this.tableName}`);
            treeObj.refresh();// 取消选中
            this.treeNode = {};
            this.$emit('clickTreeNode', arr, treeNode.ID, false);
          } else {
            arr.push(treeNode);
            this.$emit('clickTreeNode', arr, treeNode.ID, true);
          }
        } else {
          this.isClick = false;
          arr.push(treeNode);
          this.$emit('clickTreeNode', arr, treeNode.ID, true);
        }
        this.treeId = treeNode.tId;
      },
      isNull(str) {
        if (str === '') return true;
        const regu = '^[ ]+$';
        const re = new RegExp(regu);
        return re.test(str);
      },
      change(){
          this.showTip = false;
      },
      search() {
        const isNull = this.isNull(this.inputValue);
        if (!isNull) {
         
          let checkoutZtree = fuzzySearch(`${this.tableName}`, this.inputValue, null, true); // 初始化模糊搜索方法
          checkoutZtree.then((res)=>{
            if(res.length>0){
              this.showTip = false;
            }else{
              this.showTip = true;
              this.expandAll();
            }

          })
        } else {
          this.showTip = false;
          this.expandAll();
        }
      },
      expandAll() {
        // fuzzySearch('treeDemo','', null, false); // 初始化模糊搜索方法
        $.fn.zTree.init($(`#${this.tableName}`), this.setting, this.zNodes);
        this.treeId = '';
        // const treeObj = $.fn.zTree.getZTreeObj('treeDemo');
        // treeObj.refresh();// 取消选中
      },
      callMethod() { // 重置
        this.inputValue = '';
        this.search();
      }
      // freshArea() {
      //   $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
      // }
    },
    created() {
      this.tableName = `${this.$route.params.tableName}treeDemo`;
    },
    mounted() {
      this.$nextTick(() => {
        $.fn.zTree.init($(`#${this.tableName}`), this.setting, this.zNodes);
      });
     
      // $(document).ready(() => {
      //   $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
      //   fuzzySearch('treeDemo', '#key', null, true); // 初始化模糊搜索方法
      // });
    }
  };
</script>

<style>
.cancelNode{
  background:transparent !important;
}
.orange{
  color:#fd6442;
  line-height: 30px;
}
    /* #areaTree{
        border:1px solid #e5e5e5;    margin-bottom: 2px;border-radius: 4px;overflow: scroll;width: 300px;
    }
    .box-title{
        border-radius: 3px 3px 0 0;background-color: #f5f5f5;
    }
    .box-title a{
        color: #2fa4e7;
        text-decoration: none;font-size:14px;    display: block;
        padding: 8px 15px;cursor: pointer;
    }
    .box-title .fa{
        float:right;line-height: 20px;
    } */
</style>
