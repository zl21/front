import Vue from 'vue';

class ImageInnerIs {
    constructor($this, _cor_) {
        this.CorHtml = _cor_;
        this.$ = $this;
        Vue.prototype.R3_is = this;
        
    }
    init() {
        let temple =
            `
           <div>
              <h5>{{propsData}}</h5>
              <Docfile/>
              <p @click="textClick(name)">12122</p>
              <div v-for="(item, index) in valuedata" :key="index" @click="burClick(index,item)">
                  <div>{{item.NAME}}--{{index}}</div>
                 <span>{{item.URL}}</span>
               </div>
           </div>
          
          `;
        let TempleHtml = this.CorHtml;
        let ImageCom = new TempleHtml();
        let burClick = ImageCom.methods.burClick;

        ImageCom.methods.burClick = function () {
            burClick.call(this, ...arguments);
            console.log('新的点击事件');
        }
        ImageCom.methods.textClick = function (name) {
            console.log(name, '1212')
        }
        ImageCom.template = temple;
        return ImageCom.init();
    }

}



export default ImageInnerIs;