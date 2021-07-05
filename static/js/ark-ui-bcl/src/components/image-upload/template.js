import Vue from 'vue';
import Docfile from '../Docfile/Docfile.vue';

class ImageInnerHtml extends Vue {
    constructor() {
      super()
      this.setTemplate();
      this.data = this.setData;
      this.setMethods();
      this.setProps();
      this.setCompents();
    }
    setCompents(){
        this.components = { Docfile:Docfile };
    }
    setProps(){
       this.props =  {
            propsData:{  // 属性集合
                type: Object,
                default: () => {

                }
          
            }
       }
    }
    setTemplate(){
        this.template =  `
        <div  @click="textClick(name)">0909090{{name}}</div>
      `;  
    }
    setData() {
        return {
          name:'11===',  
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
        }
    }
    
    setMethods(){
        this.methods = {
            burClick(i,item){
                console.log(i)
            }
        }
        

    }
    init(html){
        let VueCompent = {
            data:this.data,
            methods:this.methods,
            props:this.props,
            components:this.components,
            template:this.template
        } 
        let ImagCom = Vue.extend(VueCompent);

        return new ImagCom().$options;

    }

}
export default ImageInnerHtml;