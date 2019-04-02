<template>
  <div>
    <slider
      :itemdata="itemdata"
      :width="width"
    />
  </div>
</template>

<script>
  import slider from './Image.vue';

  import { Upload } from '../__utils__/upload';

  export default {

    data() {
      return {
        width: 460,
        // height: 250,
        // isActive: true,
        itemdata: {
          col: 1,
          colid: 165439,
          colname: 'IMAGE',
          datelimit: 'all',
          display: 'image',
          isnotnull: false,
          isuppercase: false,
          length: 1000,
          name: '图片',
          readonly: false,
          row: 1,
          statsize: -1,
          type: 'STRING',
          valuedata: [
            { NAME: '1.jpg', URL: '/src/assets/image/1.jpg' }, 
            { NAME: '2.jpg', URL: '/src/assets/image/3.jpg' }, 
            { NAME: '3.jpg', URL: '/src/assets/image/1.jpg' }, 
            { NAME: '4.jpg', URL: '/src/assets/image/4.jpg' }, 
            { NAME: '5.jpg', URL: '/src/assets/image/1.jpg' }
          ]
        },
       
      };
    },
    components: {
      slider
    },
    mounted() {
    
    }
  };
</script>
