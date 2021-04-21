import ParameterDataProcessing from '../parameterDataProcessing';
import { isEmpty } from '../../ExtendedAttributes/common';

import {
  Version,ossRealtimeSave
} from '../../../constants/global';
export default {
  data(){
    return{
      defaultVale: null,//默认值
    }
  },
  watch:{
    value:{
      handler(val,old){
        let label = val;
        if(this.items.detailType){
          if(typeof val === 'string'){
            val = val.replace(/^\s+|\s+$/g, '')
          }
          let ParentForm = this.findParentForm();
          ParentForm.formData = Object.assign({},ParentForm.formData,ParentForm.dealData(this.items,val))
          ParentForm.formChangeData = Object.assign({},ParentForm.formChangeData,ParentForm.dealData(this.items,val))
          if(Array.isArray(val)){
            label = [];
            val = val.reduce((arr, optionII) => {
              if(optionII.ID && optionII.ID !== -1){
                arr.push(optionII.ID);
                label.push(optionII.label);
              }
              return arr;
            }, []).join(',');
            label = label.join(',')

          }
          if(this.items.type === 'NUMBER'){
            if(val){
              val = parseInt(val.replace(/-/g, ''));
            }
          } 
                   
          ParentForm.formChangeDataLabel[this.items.colname] = val
          ParentForm.formDataLabel[this.items.colname] = label;

          if(this.items.rangecolumn){
            delete ParentForm.formChangeDataLabel[this.items.colname]
          }
         
          
          if(this.actived){
           
            if(JSON.stringify(val) === JSON.stringify(this.defaultVale)){  
              delete ParentForm.formChangeData[this.items.colname]
              delete ParentForm.formChangeDataLabel[this.items.colname]
            }
          }else{
            console.log(JSON.stringify(val) === JSON.stringify(this.defaultVale),val);
            if(isEmpty(val) || JSON.stringify(val) === JSON.stringify(this.defaultVale)){
              delete ParentForm.formChangeData[this.items.colname]
            }

          }
          
          if(Version() === '1.4'){
              if(ParentForm.formChangeData[this.items.colname]===''){
                ParentForm.formChangeData[this.items.colname] = 0;
              }
          }
           
         

          

          // let activeTab = this.$_live_getChildComponent(window.vm,this.activeTab.keepAliveModuleName)
          // console.log(activeTab)
          console.log(JSON.stringify(ParentForm.formChangeData));

          if(ParentForm.$parent.formPanelChange){
            ParentForm.$parent.formPanelChange(ParentForm.formChangeDataLabel,ParentForm.formChangeData,ParentForm.formChangeDataLabel)
          }else{
            ParentForm.$parent.formChange(ParentForm.formChangeDataLabel,ParentForm.formChangeData,ParentForm.formChangeDataLabel)
          }
          // 上传后是否保存控制
          if (!ossRealtimeSave()) {    
            if (this.items.display === 'image' || this.items.display ==='OBJ_DOC') {
              // 主子表的子表修改（1:1）的情况下
              setTimeout(() => {
                const dom = document.getElementById('actionMODIFY');
                dom.click();
              }, 600);
            }
          }
        }
        
      }
    }
  },
  mounted() {
    this.defaultVale = new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items))).defaultDataProcessing() || '';
  }  
};