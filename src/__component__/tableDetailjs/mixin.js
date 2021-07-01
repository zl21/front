


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
      // 设置子表是否隐藏
      return;
      let formName = document.querySelector('.panelForm');
          //formName = 
      if(formName && this.WebConf.hiddenSubtable && this.WebConf.hiddenSubtable[this.getItemName]){
        let formData = formName._vue_.formData;
        let hiddenSubtable = this.WebConf.hiddenSubtable;
        let checked = hiddenSubtable[this.getItemName].some((item)=>{
          console.log(formData[item.colName], item.value,formData[item.colName] === item.value);
           return formData[item.colName] !== item.value;
        });
        this.updateChildTabPanels({
          key:this.getItemName,
          type:!checked
        });
       


      }  
      
    }
  },
  mounted(){
    this.$el._vue_ = this;
  }
}