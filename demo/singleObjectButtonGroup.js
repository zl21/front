


  export default {
    mounted () {
      console.log('======23232');
      let self = this;
      setTimeout(()=>{
        let buttonClick =this.buttonClick;
        this.buttonClick=function(){
          // 获取营业指标的实例
          console.log(self.$route.params,arguments,'提交之前的步骤');

          //let targetDetailToDays =  self.$_live_getChildComponent(window.vm,"TARGETDETAILTODAYS");
          if(arguments[1] && arguments[1].name === '提交'){
            console.log(self.$route.params,arguments,'提交之前的步骤');
          }else{
            // 走框架逻辑
            buttonClick.call(this, ...arguments)
          }
        }
      },100);
    }
}