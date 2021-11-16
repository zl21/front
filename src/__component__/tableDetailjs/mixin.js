


export default {
//   watch: {
//     WebConf: {
//        handler(val) {
//            if(val){
//              setTimeout(()=>{
//               this.setTabPanels();
//             },1000)
//            }
//        }   
//    }
//  },
  data(){
    return {
      exclude:[]
    }
  },
  methods:{
    setTabPanels(){
      // 设置子表是否隐藏

      if(!this.tabClick){
          return;
      }

      this.exclude = [];
      let {tableName,tableId,itemId} = this.$route.params;
      let formName = document.querySelector(`#${tableName}-${tableId}-${itemId}`);
        // 排除换组组件名称
      if(formName){
        this.formName = formName;
      }   
      if(this.formName && this.WebConf && this.WebConf.hiddenSubtable ){

        let formData = Object.assign( JSON.parse(JSON.stringify(this.formName._vue_.defaulDataValue || {}))|| {},JSON.parse(JSON.stringify(this.formName._vue_.formData || {})) || {});
        let hiddenSubtable = this.WebConf.hiddenSubtable;
        if(!this._tabPanel){
          // 记录原始tab
          this._tabPanel = this.tabPanel;
        }
        let showchecked = [];
        let checked = this._tabPanel.reduce((arr,option,index)=>{
          // 校验是否有不等的值
          let checked_value = true;
          if(hiddenSubtable[option.tablename]){
              checked_value = hiddenSubtable[option.tablename].some((item)=>{
                let values = item.value.split(',');
                let value_check = values.some((x)=>{ 
                  return x==formData[item.colName]
                })
                return value_check;
              });
          }
          if(checked_value){
            // 被隐藏的子表名称
            showchecked.push(option.tablename);
          }
          // 展示的组 true 代表组件不可显示
          arr[option.tablename] = checked_value;
          if(!checked_value){
            this.exclude.push('tapComponent.'+option.tablename);
          }
          return arr;

        },{});
        let checkedValue = this.tabPanel.reduce((arr,element) => {
          if(element.hide){
            arr.push(element.hide);
          }
          return  arr;
        },[]);
               
       if(this.exclude.length!==checkedValue.length){
          //  兼容外键字段
          document.body.click();
       }
        
       
         setTimeout(()=>{
          //  更新子表
          this.updateChildTabPanels({
            value:checked
          });

          if(showchecked.length>0 &&  this.$refs.tabPanel && this.tabPanel.length!== showchecked.length){
            if(this.$refs.tabPanel.activeKey!== this.tabCurrentIndex){
              this.tabClick(this.tabCurrentIndex);
            }
            if(this.$refs.tabPanel){
              this.$refs.tabPanel.$el.style.display='block';
              this.$refs.tabPanel.activeKey = this.tabCurrentIndex;
            }

          }else{
            if(this.$refs.tabPanel){
              this.$refs.tabPanel.$el.style.display='none';

            }
          }
        },200)


       
        
        

  


      }  
      
    }
  },
  mounted(){
    this.$el._vue_ = this;
  }
}