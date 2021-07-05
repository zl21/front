<template>
  <div id="Wangeditor-demo">
    <H5>图片上传</H5>
    <ImageUpload :serviceId="localHost" :PropsData="dataitem" v-model="valuedata"></ImageUpload>

  </div>
</template>
<script>
import ImageUpload from '../components/image-upload/ImageUpload';
import Mixin from './mixin/common.js';

export default {
  components: {
    ImageUpload,
  },
  mixins: [Mixin],
  data () {
    return {
      valuedata:[],
      localHost: "http://jsonplaceholder.typicode.com",
      dataitem: {
        url: '/posts', // 上传地址
        sendData: {}, // 上传参数
        readonly: false,
        name: '上传'  //点击上传按钮名称
      }
    }
  },
  mounted () {
    console.log(ImageUpload, 'ImageUpload');
  }
}

</script>
