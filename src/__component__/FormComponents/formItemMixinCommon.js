import network from '../../__utils__/network.js';

export default {
  data() {
    return {
      actived:false, // 渲染未完成
      rules:{},
      initTimer:null
    };
  },
  methods:{
    validateInput() {
      return new Promise((resolve) => {
      const preverifyenabled = this.items.preverifyenabled;
      if (preverifyenabled) {
        network.post('/p/cs/verifyObject', {
          OBJ_ID: this.$route.params.itemId === 'New' ? -1 : this.$route.params.itemId,
          TABLE_NAME: this.$route.params.tableName,
          VERIFY_COLUMN: {
            [this.items.colname]: this.value
          }
        }).then((res) => {
          if (res.data.code === 1) {
            resolve(res.data.message);
            // this.$Modal.fcError({
            //   title: '错误',
            //   content: res.data.message,
            //   mask: true
            // });
          }else{
            resolve('');
          }
        });
      }
    });
    },
    setRules(){
      let required = this.items.show && !this.items.readonly && this.items.isnotnull ; 
      if(this.items.show && this.items.show_occupied === false){
        // 兼容隐藏时候的占位
        required = false;
      }
      let self = this;
      this.rules = {
        required: {
          type:required,
          message: `${this.items.name}不能为空!`, 
          trigger: 'blur'
        }, 
        trigger:{
          blur:{
            callback:function(val){
              return self.validateInput();
            },
        }                
      }
        
      }
    

    }
  },
  mounted() {
    // 设置校验规则
    this.setRules();
<<<<<<< HEAD
    let self = this;
    this.$parent.$parent.$parent.$nextTick(()=>{
      setTimeout(()=>{
        // 延时渲染完成,阻止页面初始化调用事件
        self.actived = true;    
      },100);
    })
   
=======
    setTimeout(()=>{
      // 延时渲染完成,阻止页面初始化调用事件
      this.actived = true;    
    },500);
>>>>>>> npm_dev_r3
  }  
};