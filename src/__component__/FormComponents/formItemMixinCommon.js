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
      let required = this.items.show && !this.items.readonly && this.items.isnotnull; 
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
    setTimeout(()=>{
      // 延时渲染完成,阻止页面初始化调用事件
      this.actived = true;    
    },200);
  }  
};