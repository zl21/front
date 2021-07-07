


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
      //return;
      let formName = document.querySelector('.panelForm');
      //formName = 
      //this.tabClick(1);

      if(!this.tabClick){
          return;
      }
      this.exclude = [];
      if(formName && this.WebConf && this.WebConf.hiddenSubtable ){

        let formData = Object.assign( JSON.parse(JSON.stringify(formName._vue_.defaulData))|| {},JSON.parse(JSON.stringify(formName._vue_.formData)) || {});
        let hiddenSubtable = this.WebConf.hiddenSubtable;
        if(!this._tabPanel){
          this._tabPanel = this.tabPanel;
        }
      
        let tabCurrentIndex = this.tabCurrentIndex;
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
          
          arr[option.tablename] = !checked_value;
          if(!checked_value){
            this.exclude.push('tapComponent.'+option.tablename);
          }
     
          // 判断当前的tab 是否被隐藏
          if( !checked_value && index === tabCurrentIndex ){
            tabCurrentIndex = '-1';
          }
          return arr;

        },{});
        this.updateChildTabPanels({
          value:checked,
          index:tabCurrentIndex,
          getItemName:this.getItemName,
          tabPanel:this._tabPanel
        });
     
        if(this.tabPanel.length>0){
          this.tabClick(this.tabCurrentIndex);
          if(this.$refs.tabPanel){
            this.$refs.tabPanel.activeKey = this.tabCurrentIndex;
          }

        }
        

  


      }  
      
    }
  },
  mounted(){
    this.$el._vue_ = this;
  }
}