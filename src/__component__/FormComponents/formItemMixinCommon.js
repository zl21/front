export default {
  data() {
    return {
      actived:false, // 渲染未完成
    };
  },
  mounted() {
    // 设置校验规则
    
    this.items.rules = {
      required: {
        type:true,
        message: `${this.items.name}不能为空!`, 
        trigger: 'blur'
      }, 
      trigger:{
          blur:{
            // max:3,
            message: '失去光标最大长度为3', 
          },
          // change:{
          //   regx:'',
          //   min:3,
          //   max:10,
          //   message: '最大长度为10,最小长度为3', 
          // },
          // change:{
          //   regx:'\\d',
          //   message: '只能输入数字', 
          // },
          // change:{
          //   callback:function(val){
          //       console.log(val);
          //       return `${val} 的值不对`
          //   },
          // },
          change:{
            callback:function(val){
              return new Promise((resolve) => {
                      resolve(` 获取的值${val}`);
              });
            },
          }            
      },
      
    }
    setTimeout(()=>{
      // 延时渲染完成,阻止页面初始化调用事件
      this.actived = true;    
    },50);
  }  
};