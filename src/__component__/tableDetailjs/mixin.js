


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

        let formData = Object.assign( JSON.parse(JSON.stringify(this.formName._vue_.defaulData))|| {},JSON.parse(JSON.stringify(this.formName._vue_.formData)) || {});
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
                //return formData[item.colName] !== item.value;
                return !values.includes(formData[item.colName]);
              });
          }
          if(checked_value){
            showchecked.push(option.tablename);
          }
          arr[option.tablename] = !checked_value;
          if(!checked_value){
            this.exclude.push('tapComponent.'+option.tablename);
          }
     
          // 判断当前的tab 是否被隐藏
          // if( !checked_value && index === tabCurrentIndex ){
          //   tabCurrentIndex = '-1';
          // }
          return arr;

        },{});
        let checkedValue = this.tabPanel.some(element => {
          return checked[element.tablename]
        });
        
       
      console.log(checkedValue);
        // if(checkedValue){
        //   // 兼容外键点击事件
        //   document.body.click();

        // }
        
       

         setTimeout(()=>{
          this.updateChildTabPanels({
            value:checked
          });
          console.log(showchecked,this.tabCurrentIndex);
          if(showchecked.length>0 ){
            this.tabClick(this.tabCurrentIndex);
            if(this.$refs.tabPanel){
              this.$refs.tabPanel.$el.style.display='block';
              this.$refs.tabPanel.activeKey = this.tabCurrentIndex;

            }

          }else{
            if(this.$refs.tabPanel){
              this.$refs.tabPanel.$el.style.display='none';

            }
          }
        },100)


       
        
        

  


      }  
      
    }
  },
  mounted(){
    this.$el._vue_ = this;
  }
}