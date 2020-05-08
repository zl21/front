<template>
  <div
    class="R3-buttonList"
  >
    <div class="R3-button-group">
      <Button
        v-for="(item) in buttonsData"
        :id="item.eName"
        :key="item.webid"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick(item)"
        v-text="item.webdesc" 
      />
    </div>
  </div>
</template>
<script> 


  export default {
    name: 'ButtonList',
    props: {
      buttonsData: {// 获取自定义按钮组
        type: Array,
        default: () => []
      },
    },
    mounted() {
    },
    components: {
    },
    methods: {
      btnclick(obj) {
        this.$emit('btnclick', obj);
      }
    },
    data() {
      return {
     
      };
    },
 
   
  };
</script>

<style lang="less" scope>
.R3-buttonList {
  padding: 8px 0px;
  
  > div {
    display: inline-block;
  }
  }
  .R3-button-group {
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    flex-wrap: wrap;
    .hide{
      display:none;
    }
    .burgeon-select-dropdown {
      .burgeon-dropdown-menu {
        min-width: 58px;
        .burgeon-dropdown-item {
          padding: 5px 6px;
        }
      }
    }
    .ff--el-dropdown {
      float: left;
    }
    button {
      height: 22px;
      line-height: 18px;
      margin-right: 8px;
      margin-left: 0px;
      padding: 0 8px;
      margin-bottom: 4px;
    }
    > button:last-child {
      margin-right: 0px;
    }
    .hiddenDropdown {
      height: 24px;
      button {
        margin-top: -1px;
      }
    }
    .iconfont{
      font-size: 12px;
    }
    .collection,.burgeon-btn-fcdefault{
      min-width: auto !important;
    }
  }

</style>
