export default {
  data() {
    return {
      actived:false, // 渲染未完成
    };
  },
  mounted() {
    setTimeout(()=>{
      // 延时渲染完成,阻止页面初始化调用事件
      this.actived = true;
    },50);
  }  
};