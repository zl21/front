<!--引入曼卡龙的弹框组件-->
<template>
  <div>
    <div class="editor">
      editor测试
    </div>
  </div>
</template>

  <script>
  import wangEditor from '../assets/js/wangeditor/wangEditor';

  export default {
    name: 'Wangeditor',
    props: {
      
    },
    data() {
      return {
        showModal: false,
      };
    },
    mounted() {

    },
    methods: {
     
    
    }
  };
  </script>

  <style lang="less">
    .editor {
    b {
    font-weight: bold;
    }
    }

    #editor_layer {
    background: #f1f1f1;
    position: absolute;
    width: 100%;
    top: 0px;
    height: 33px;
    z-index: 103;
    opacity: 0.5;
    }

    #_wangEditor_btn_fullscreen {
    position: relative;
    z-index: 150;
    }

    .w-e-toolbar {
    flex-wrap: wrap;
    -webkit-box-lines: multiple;
    }

    .w-e-toolbar .w-e-menu:hover {
    z-index: 10002 !important;
    }

    .w-e-menu a {
    text-decoration: none;
    }

    .fullscreen-editor {
    position: fixed !important;
    width: 100% !important;
    height: 100% !important;
    left: 0px !important;
    top: 0px !important;
    background-color: white;
    z-index: 9999;
    }

    #_wangEditor_btn_html {
    position: relative;
    z-index: 150;
    }

    .fullscreen-editor .w-e-text-container {
    width: 100% !important;
    height: 95% !important;
    }
  </style>
