import network from '../../__utils__/network.js';

export default {
  data() {
    return {
      actived:false, // 渲染未完成
    };
  },
  methods:{
    validateInput() {
      console.log(this.value);
      return new Promise((resolve) => {
  
      const preverifyenabled = this.items.preverifyenabled;
      if (preverifyenabled) {
        network.post('/p/cs/verifyObject', {
          OBJ_ID: this.$route.params.itemId === 'New' ? -1 : this.$route.params.itemId,
          TABLE_NAME: this.$route.params.tableName,
          VERIFY_COLUMN: {
            [this.items.field]: this.value
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
  },
  mounted() {
    // 设置校验规则
    let required = !this.items.readonly && this.items.isnotnull; 
    let self = this;
    this.items.rules = {
      required: {
        type:required,
        message: `${this.items.name}不能为空!`, 
        trigger: 'blur'
      }, 
      trigger:{
          // blur:{
          //    max:3,
          //   message: '失去光标最大长度为3', 
          // },
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
              return self.validateInput();
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