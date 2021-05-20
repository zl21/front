import ParameterDataProcessing from '../parameterDataProcessing';
import {
  isEmpty
} from '../../ExtendedAttributes/common';

import {
  Version,
  ossRealtimeSave
} from '../../../constants/global';
export default {
  data() {
    return {
      defaultVale: null, //默认值
    }
  },
  watch: {
    value: {
      handler(val, old) {
        if (this.items.detailType) {
          let ParentForm = this.findParentForm();
          // 获取当前组件的值
          let current_value = ParentForm.dealData(this.items, val)[this.items.colname];
          let current_data = {};

          // 去除空格
          if (typeof current_value === 'string' && !isEmpty(current_value)) {
            current_value = current_value.toString().replace(/^\s+|\s+$/g, '')
          }else{
            // 上传后是否保存控制
            if (this.items.display === 'image' || this.items.display === 'OBJ_DOC') {
              // 主子表的子表修改（1:1）的情况下
              if(Array.isArray(current_value)){
                current_value = JSON.stringify(current_value);
              }else{
                current_value = (current_value || []).toString();
              }
              
            }  
          }
          
        
           // number类型空值传0
           if (this.items.type === 'NUMBER') {
            if (current_value && !isEmpty(current_value)) {
              if(current_value.toString().split('-').length>2){
                current_value = parseFloat(current_value.toString().replace(/-/g, ''));
              }else{
                current_value = parseFloat(current_value);
              }
            }
            if (Version() === '1.4') {
              if (current_value === '') {
                current_value = 0;
              }
            }
            
          }
          // 拼接当前key 和 value
          current_data = {
            [this.items.colname]: current_value
          }

          // ParentForm.formData 表单组件的所有有值的值
          ParentForm.formData = Object.assign({}, ParentForm.formData, current_data)
          ParentForm.formDataLabel[this.items.colname] = val
          if(this.items.display === 'image' || this.items.display === 'OBJ_DOC'){
            ParentForm.formDataLabel[this.items.colname] = current_value;
          }else{
            ParentForm.formDataLabel[this.items.colname] = val;
          }
          if(this.items.display ==='OBJ_CHECK' || this.items.display ==='OBJ_SELECT'){
            const optionIndex = this.items.combobox.findIndex(x => x.limitval === val);
            if (optionIndex !== -1) {
              ParentForm.formDataLabel[this.items.colname] = this.items.combobox[optionIndex].limitdesc;
            }
          }
          if(this.items.fkobj && (this.items.fkobj.searchmode === 'pop' || this.items.fkobj.searchmode === 'drp')){
            if (Version() === '1.4') {
              if (current_value === '') {
                current_value = 0;
              }
            }

          }
         
          let keepAliveModuleName = this.activeTab.keepAliveModuleName && (this.activeTab.keepAliveModuleName).toLocaleUpperCase();
            // 初始化的状态
            if (!this.actived) {
              if (/NEW/.test(keepAliveModuleName)) {
                // 删除空值
                if (isEmpty(val)) {
                  delete ParentForm.formData[this.items.colname]
                }
              }
              ParentForm.defaulData = JSON.parse(JSON.stringify(ParentForm.formData));
              ParentForm.defaulDataLabel = JSON.parse(JSON.stringify(ParentForm.formDataLabel));
              this.InitializationForm(ParentForm);
              return;
            } else {
              // 页面修改

              if(this.items.rangecolumn){
                if (val[0] && val[1]) {
                  ParentForm.formChangeData[this.items.rangecolumn.upperlimit.colname] = val[0];
                  ParentForm.formChangeData[this.items.rangecolumn.lowerlimit.colname] = val[1];
                }else {
                  ParentForm.formChangeData[this.items.rangecolumn.upperlimit.colname] = '';
                  ParentForm.formChangeData[this.items.rangecolumn.lowerlimit.colname] = '';
                }
              }

              if (/NEW/.test(keepAliveModuleName)) {
                // 新增  删除空值,且没有默认值     
                ParentForm.formChangeData = Object.assign({}, ParentForm.formChangeData, current_data)
                if (isEmpty(val) && isEmpty(this.defaultVale)) {
                  delete ParentForm.formData[this.items.colname]
                  const data = {
                    key: this.items.colname,
                    itemName: this.activeTab.tableName
                  };
                  // 删除新增有值后变空
                  ParentForm.deleteFormData(data)
                }
                // 默认值
                ParentForm.defaulData = JSON.parse(JSON.stringify(ParentForm.formData));
                ParentForm.defaulDataLabel = JSON.parse(JSON.stringify(ParentForm.formDataLabel));
                // this.InitializationForm(ParentForm)
                this.changeForm(ParentForm);
                return;
                
              }else{
                //详情明细  有值 
                ParentForm.formChangeData = Object.assign({}, ParentForm.formChangeData, current_data)
                ParentForm.formChangeDataLabel = Object.assign({}, ParentForm.formDataLabel, current_data)

                if (JSON.stringify(val) === JSON.stringify(this.defaultVale)) {
                  delete ParentForm.formChangeData[this.items.colname]
                  delete ParentForm.formChangeDataLabel[this.items.colname]
                   // 删除新增有值后变空
                   const data = {
                    key: this.items.colname,
                    itemName: this.activeTab.tableName
                  };
                   ParentForm.deleteFormData(data)
                }else{
                  if(this.items.rangecolumn){
                    if (val[0] && val[1]) {
                      ParentForm.formChangeData[this.items.rangecolumn.upperlimit.colname] = val[0];
                      ParentForm.formChangeData[this.items.rangecolumn.lowerlimit.colname] = val[1];
                    }
                  }

                }

              }
              // 虚拟区间不用传值
              if (this.items.rangecolumn) {
                delete ParentForm.formData[this.items.colname];
                delete ParentForm.formDatadefault[this.items.colname];
                delete ParentForm.formChangeData[this.items.colname];
              }
              
  
              if (!ossRealtimeSave() && JSON.stringify(val) !== JSON.stringify(this.defaultVale)) {
                if (this.items.display === 'image' || this.items.display === 'OBJ_DOC') {
                  // 主子表的子表修改（1:1）的情况下
                  setTimeout(() => {
                    const dom = document.getElementById('actionMODIFY');
                    if (dom) {
                      dom.click();
                    }

                  }, 600);
                }
              }
            }
            this.changeForm(ParentForm);
            
         

         
          



        }

      }
    }
  },
  methods:{
    InitializationForm(ParentForm){
      // 默认值
      ParentForm.initializationForm();
    },
    changeForm(ParentForm){
      // 修改后
      if (ParentForm.$parent.formPanelChange) {
        ParentForm.$parent.formPanelChange(ParentForm.formChangeData, ParentForm.formDataLabel,ParentForm.formChangeDataLabel)
      }else{
        ParentForm.$parent.formChange(ParentForm.formChangeData, ParentForm.formDataLabel,ParentForm.formChangeDataLabel)
      }
    }
  },
  mounted() {
    this.defaultVale = new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items))).defaultDataProcessing() || '';
  }
};