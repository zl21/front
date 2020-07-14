<template>
  <div
    :id="elementId"
    class="ztree"
  />
</template>
<script>
  import './js/jquery.ztree.core.min';
  import './js/jquery.ztree.excheck.min';
  import './js/jquery.ztree.exedit.min';
  import './js/jquery.ztree.exhide.min';
  

  export default {
    props: {
      elementId: {
        type: String,
        default: 'ztree'
      },
      zNodes: {
        type: Array,
        default: () => []
      },
      event: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        setting: {
          check: {
            enable: true, // checkbox
            chkStyle: 'checkbox',
            // nocheckInherit: false
          },
          view: {
            selectedMulti: false,
            // showIcon: false,
            // expandSpeed: null,
            // showIcon: true,
            // nameIsHTML: true,
            // dblClickExpand: false,
            // showLine: true,
            // showTitle: true,
            // fontCss: this.setFontCss
          },
          anync: {
            enable: true,
          },
          callback: {
            onCheck: this.onCheck,
            beforeExpand: this.beforeExpand,
            // beforeClick: this.beforeClick,
            // onClick: this.onClick
          },
          edit: {
            // enable: false,
            // editNameSelectAll: false
          },
          data: {
            key: {
              children: 'children',
              name: 'ENAME',
              title: 'ENAME',
            },
            simpleData: {
              enable: true,
              // idKey: 'id', // 树节点ID名称
              // pIdKey: 'parentId', // 父节点ID名称
            // rootPId: -1,//根节点ID
            }
          },
        }
      };
    },
    watch: {
      zNodes: {
        handler() {
          $.fn.zTree.init($(`#${this.elementId}`), this.setting, this.zNodes);
        },
        deep: true
      },
    },
    methods: {
    },
    mounted() {
      let defaultCallback = this.setting.callback;
      defaultCallback = Object.assign(defaultCallback, this.event);
      this.setting.callback = defaultCallback;
      $.fn.zTree.init($(`#${this.elementId}`), this.setting, this.zNodes);
    },
    beforeDestroy() {
      const zTreeObj = $.fn.zTree.getZTreeObj(this.elementId);
      zTreeObj.destroy();
    }
  };
</script>
<style lang="less">
@import "../ztree/css/zTreeStyle/zTreeStyle.css";

</style>
