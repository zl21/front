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
    this.instance = instance;
  }
  blur(name){
    // 下拉失去光标
     let blurName = name? name :'on-blur';
     if(!this.instance.eventFunction){
        return;
     }
     let blur = this.instance.eventFunction[blurName];
     let self = this;

    //  this.instance.eventFunction[blurName] =function(){
    //     if(self.item.detailType){
    //       // 单对象保存界面,必须有值才能展示
    //       setTimeout(()=>{
    //         if(!Array.isArray(self.instance.value)){
    //          let dom =  self.instance.$el.querySelector('.iconios-close-circle');
    //          if(dom){
    //             dom.click();
    //          }
    //         }
    //       },200)
            
    //     }
    //     if(blur){
    //       blur.call(this, ...arguments);
    //     }
    // }
    
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