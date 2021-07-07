<template>
  <div id="Wangeditor-demo">
    <button @click="showImage">图片预览</button>
    <PreviewPicture :images="value"
                    :show="show"
                    @on-cancel="()=>{
                        this.show = false;
                      }"
                    :defaultIndex="defaultIndex"/>

  </div>
</template>
<script>
  import PreviewPicture from '../components/preview-picture/index';
  import Mixin from '../demo/mixin/common.js';

  export default {
    components: {
      PreviewPicture,
    },
    mixins: [Mixin],
    data() {
      return {
        show: false,
        defaultIndex: 0,
        value: [{
          "name": "package.json",
          "url": "http://arkui.dev.syman.cn/7ae2876ae1edf36a6e738d7b37910dd0.png",
          "Size": "2K"
        }, {
          "name": "build.config - 副本.json",
          "url": "http://arkui.dev.syman.cn/7ae2876ae1edf36a6e738d7b37910dd0.png",
          "Size": "638B"
        }]
      }
    },
    methods: {
      showImage() {
        this.show = true;
      }
    }
  }

</script>
