<template>
<!-- <ImageUpload
   :dataitem="dataitem"
></ImageUpload> -->
  <div>
    666666
     <component :is="template" :propsData ="dataitem" />
  </div>
</template>

<script>
 
//               new Vue({
//   template:`
//     <div>
//       {{n}}
//       <button @click="add">+1</button>
//     </div>
//   `,
//   data:{n:0},
//   methods: {add(){this.n +=1}}
// })
    import Vue from 'vue';
    import TempleHtml from './template';
    import ImageInnerIs from './isNew';
    export default {
      mounted(){
         this.setItem();
      },
      methods:{
          setItem(){
          //   this.template = {
          //     data(){
          //        return {
          //           name:'1212'
          //        }
          //     },
          //     template:`
          //     <div>0909090{{name}}</div>
          //     `
          //   };
          //    let ImagCom = Vue.extend(this.template);

          //  return new ImagCom().$options;
          this.template = new ImageInnerIs(this,TempleHtml).init();

          }
          
      },
      data() {
        return {
          template:'',
          bus:'',
          name:'1111',
          dataitem: {
            url: '', // 上传地址
            sendData: {}, // 上传参数
            width: 250,
            height: 250,
            readonly: false, 
            valuedata: [
                 {
                      NAME: '1.jpg',
                      URL:
                        'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1561364661&di=766d38b55df12b23516f195942aa0055&src=http://img.zhiribao.com/upload/images/201607/6/6b0152a5b29f309f3f92f52adc6cd017eae73133.jpg'
                    },
                     {
                      NAME: '2.jpg',
                      URL:
                        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561374887838&di=8027dfa1209bc0033b5168958c4608b2&imgtype=0&src=http%3A%2F%2Fimg.sccnn.com%2Fbimg%2F337%2F31662.jpg'
                    },
            ],
            name: '上传'  //点击上传按钮名称
          }
        };
      },
    }
</script>