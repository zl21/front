<template>
  <div>
    <h1>Router Info: {{ $route.path }}</h1>
    <!-- 按钮栏组件 -->
    <h2>按钮栏组件</h2>
    <buttonGroup :data-array="dataArray" />


    <!-- Form 表单组件 -->
    <h2>Form 表单组件</h2>
    
    <!-- 表格组件 -->
    <h2>表格组件</h2>
  </div>
</template>

<script>
  import buttonGroup from './button';

  export default {
    data() {
      return {
        dataArray: {
          printValue: true,
          waListButtons: [
            {
              action: '/p/c/loadschema',
              actiontype: 'url',
              confirm: null,
              cuscomponent: null,
              ishide: false,
              isrefrsh: false,
              vuedisplay: 'slient',
              webdesc: '重载',
              webicon: null,
              webid: 2221,
              webname: 'loadschema',
            }
          ],
          buttonGroupShow: [
  
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '新增',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '删除',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '批量修改',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '导入',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '导出',
              requestUrlPath: '',
            },
          ],
        }

      };
    },
    components: {
      buttonGroup
    },
    methods: {
      
    }
  };
</script>

<style lang="less">

</style>
