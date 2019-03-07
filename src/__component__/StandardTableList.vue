<template>
  <div>
    <h1>Router Info: {{ $route.path }}</h1>
    <!-- 按钮栏组件 -->
    <h2>按钮栏组件</h2>
    <div class="buttonList">
      <div class="button-group">
        <Button
          type="warning"
          class="searchButton"
          size="small"
          @click="searchData('search')"
        >
          {{ SEARCH }}
        </Button>
        <myButton
          v-for="(item, index) in buttonGroupShow"
          :key="index"
          :btntype="item.btntype"
          :title="item.title"
          :size="item.size"
          :disabled="item.disabled"
          :class="item.className"
          :icon="item.iconName"
        />
      </div>
    </div>


    <!-- Form 表单组件 -->
    <h2>Form 表单组件</h2>
    
    <!-- 表格组件 -->
    <h2>表格组件</h2>
  </div>
</template>

<script>
  import myButton from './button';

  export default {
    data() {
      return {
        SEARCH: '查找',
        buttonGroupShow: [{
                            btntype: 'warning',
                            title: '新增',
                            size: 'small',
                            btnclick: () => {
                              alert(this);
                            } // 按钮点击事件
                          },
                          {
                            btntype: 'warning',
                            title: '删除',
                            size: 'small',
                          },
                          {
                            btntype: 'warning',
                            title: '批量修改',
                            size: 'small',
                          },
                          {
                            btntype: 'warning',
                            title: '导入',
                            size: 'small',
                          },
                          {
                            btntype: 'warning',
                            title: '打印',
                            size: 'small',
                          },
        ]

      };
    },
    components: {
      myButton
    },
    methods: {
      
    }
  };
</script>

<style lang="less">

   .buttonList {
     .button-group {
        display: flex;
        flex: 1;
        text-align: right;
        font-size: 0;
        overflow: hidden;
        // flex-direction: column;
       .buttontemp{
            margin-left: 8px;
      }
     }
     
  }
</style>
