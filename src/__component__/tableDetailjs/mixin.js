


export default {
  watch: {
    WebConf: {
       handler(val) {
           if(val){
             this.setTabPanels();
           }
       }   
   }
 },
  methods:{
    setTabPanels(){
      // 设置子表是否隐藏      return;
      return;
      let formName = document.querySelector('.panelForm');
          //formName = 
          //this.tabClick(1);
      if(formName && this.WebConf && this.WebConf.hiddenSubtable && this.WebConf.hiddenSubtable[this.getItemName]){
        let formData = formName._vue_.formData;
        let hiddenSubtable = this.WebConf.hiddenSubtable;
        
        let checked = this.tabPanel.reduce((arr,option)=>{
          console.log( hiddenSubtable[option.tablename]);
            let checked_value = hiddenSubtable[option.tablename].some((item)=>{
              return formData[item.colName] !== item.value;
          });
          arr[option.tablename] = !checked_value;
          return arr;

        },{});

        this.updateChildTabPanels(checked);
        //this.tabClick
        //let inde 
       


      }  
      
    }
  },
  mounted(){
    this.$el._vue_ = this;
  }
}