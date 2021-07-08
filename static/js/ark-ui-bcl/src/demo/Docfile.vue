<template>
  <div id="Wangeditor-demo">
    <Docfile
            v-model="value"
            :dataitem="dataitem"
            :serviceId="localHost"
    ></Docfile>

  </div>
</template>
<script>
  import Docfile from '../components/docfile/Docfile';
  import Mixin from '../demo/mixin/common.js';

  export default {
    components: {
      Docfile,
    },
    mixins: [Mixin],
    data() {
      return {
        value: [{
          "name": "package.json",
          "url": "http://r3-project-file.oss-cn-hangzhou.aliyuncs.com/haha/package.json",
          "Size": "2K"
        }, {
          "name": "build.config - 副本.json",
          "url": "http://r3-project-file.oss-cn-hangzhou.aliyuncs.com/haha/build.config - 副本.json",
          "Size": "638B"
        }],
        dataitem: {
          url: '/posts', // 上传地址
        },
        localHost: "http://jsonplaceholder.typicode.com",
      }
    }
  }

</script>
