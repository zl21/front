/** 处理下拉外健公共事件 
 * 
*/
// import {
//   postData,
//   postTableData
// } from '../ExtendedAttributes/refcolval.js'
// import Vue from 'vue';

export default class DropMethods {
  constructor(item, instance){
    this.item = item
    this.instance = Object.create(instance);
  }
  blur(name){
    // 失去光标
     let blurName = name? name :'on-blur';
     let blur = this.instance.methods[blurName];
     let self = this;
    this.instance.methods[blurName] =function(){
     
        if(self.item.detailType){
          // 单对象保存界面,必须有值才能展示
          setTimeout(()=>{
            console.log(this,'blurName',blurName);
            if(!Array.isArray(this.$parent.value)){
            //  let dom =  this.$el.querySelector('.iconios-close-circle');
            //  if(dom){
            //     dom.click();
            //  }
            }
          },400)
            
        }
        if(blur){
          blur.call(this, ...arguments);
        }
    }
    
  }

  

  keydown(name){
    let keydownName = name? name :'on-keydown';
    this.instance.methods[keydownName] = function () {
      var args =[].slice.call(arguments);
      let event = args.reduce((arr,x)=>{
          if(x.code){
            arr = x;
          }
          return arr;
      },{});
      if (event.code === 'Enter') {
        if( this.$parent && this.$parent.$parent && this.$parent.$parent.$parent && this.$parent.$parent.$parent){
          if(typeof this.$parent.$parent.$parent.handleEnter ==='function'){
            this.$parent.$parent.$parent.handleEnter(...arguments);
          }
        }
      }
    };
  }
}