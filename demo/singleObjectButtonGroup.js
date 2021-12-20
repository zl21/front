


  export default {
    mounted () {
      // 保存回调函数
      let saveAfter = this.saveAfter;
      this.saveAfter = function(){
        saveAfter.call(this,...arguments);
        /*
        arguments[0]  add  新增    modify  修改
        arguments[1]  表明
        */ 
        console.log('执行完框架逻辑处理自己的逻辑');
      };

      // setTimeout(()=>{
      //   let buttonClick =this.buttonClick;
      //   this.buttonClick=function(){
      //     // 获取营业指标的实例
      //     console.log(self.$route.params,arguments,'提交之前的步骤');
      //     //let targetDetailToDays =  self.$_live_getChildComponent(window.vm,"TARGETDETAILTODAYS");
      //     if(arguments[1] && arguments[1].name === '提交'){
      //       console.log(self.$route.params,arguments,'提交之前的步骤');
      //     }else{
      //       // 走框架逻辑
      //       buttonClick.call(this, ...arguments)
      //     }
      //   }
      // },100);
    }
}