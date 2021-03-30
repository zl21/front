import ParameterDataProcessing from '../parameterDataProcessing';

export default {
  data(){
    return{
      defaultVale: null,//默认值
    }
  },
  watch:{
    value:{
      handler(val,old){
        if(this.items.detailType){
          let ParentForm = this.findParentForm()

          ParentForm.formData = Object.assign({},ParentForm.formData,ParentForm.dealData(this.items,val))
          ParentForm.formChangeData = Object.assign({},ParentForm.formChangeData,ParentForm.dealData(this.items,val))
          ParentForm.formDataLabel[this.items.colname] = val
          
          if(JSON.stringify(val) === JSON.stringify(this.defaultVale) || (!val && !this.defaultVale)){
            delete ParentForm.formChangeData[this.items.colname]
            delete ParentForm.formDataLabel[this.items.colname]
          }

          

          // let activeTab = this.$_live_getChildComponent(window.vm,this.activeTab.keepAliveModuleName)
          // console.log(activeTab)
          if(ParentForm.$parent.formPanelChange){
            ParentForm.$parent.formPanelChange(ParentForm.formDataLabel,ParentForm.formChangeData,ParentForm.formDataLabel)
          }else{
            ParentForm.$parent.formChange(ParentForm.formDataLabel,ParentForm.formChangeData,ParentForm.formDataLabel)
          }
          
        }
        
      }
    }
  },
  mounted() {
    this.defaultVale = new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items))).defaultDataProcessing() || '';
  }  
};