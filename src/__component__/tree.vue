<template>
  <div class="tree">
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

        treeData: [
          {
            expand: true, // 是否开启

            title: 'ceshi',
            TREENO: 2,
            MIXNAME: '[001]ceshi',
            ECODE: '001',
            RIGHTVALUE: 12,
            ID: 2,
            LEFTVALUE: 1,
            clickNode: true,
            children: [
              {
                title: 'CYX内部组织档案',
                TREENO: 2,
                MIXNAME: '[10001]CYX内部组织档案',
                ECODE: '10001',
                RIGHTVALUE: 7,
                ID: 7,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 4,
                lastChild: false,
                children: [
                  {
                    title: '销售部',
                    TREENO: 2,
                    MIXNAME: '[011]销售部',
                    ECODE: '011',
                    RIGHTVALUE: 6,
                    ID: 13,
                    CP_C_ORGUP_ID: 7,
                    LEFTVALUE: 5,
                    lastChild: true,
                    children: []
                  }
                ]
              },
              {
                title: '11',
                TREENO: 2,
                MIXNAME: '[11]11',
                ECODE: '11',
                RIGHTVALUE: 9,
                ID: 10,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 8,
                lastChild: false,
                children: []
              },
              {
                title: '12',
                TREENO: 2,
                MIXNAME: '[12]12',
                ECODE: '12',
                RIGHTVALUE: 3,
                ID: 1,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 2,
                lastChild: false,
                children: []
              },
              {
                title: 'llnlin',
                TREENO: 2,
                MIXNAME: '[LINLIN]llnlin',
                ECODE: 'LINLIN',
                RIGHTVALUE: 11,
                ID: 12,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 10,
                lastChild: true,
                children: []
              }
            ]
          }
        ],
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
