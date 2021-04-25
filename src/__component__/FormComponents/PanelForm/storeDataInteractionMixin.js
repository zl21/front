import ParameterDataProcessing from '../parameterDataProcessing';
import {
  isEmpty
} from '../../ExtendedAttributes/common';

import {
  Version,
  ossRealtimeSave
} from '../../../constants/global';
import {
  container
} from 'webpack';
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
            current_value = current_value.replace(/^\s+|\s+$/g, '')
          }else{
            // 上传后是否保存控制
            if (this.items.display === 'image' || this.items.display === 'OBJ_DOC') {
              // 主子表的子表修改（1:1）的情况下
              if(Array.isArray(current_value)){
                current_value = JSON.stringify(current_value);
              }
              
            }  
          }
          // number类型空值传0
          if (this.items.type === 'NUMBER') {
            if (current_value && !isEmpty(current_value)) {
              current_value = parseInt(current_value.replace(/-/g, ''));
            }
            if (Version() === '1.4') {
              if (ParentForm.formChangeData[this.items.colname] === '') {
                ParentForm.formChangeData[this.items.colname] = 0;
                ParentForm.formData[this.items.colname] = 0;

              }
            }
          }
          // 拼接当前key 和 value
          current_data = {
            [this.items.colname]: current_value
          }
          // ParentForm.formData 表单组件的所有有值的值
          ParentForm.formData = Object.assign({}, ParentForm.formData, current_data)
          ParentForm.formChangeDataLabel[this.items.colname] = val
          ParentForm.formDataLabel[this.items.colname] = val;

          
          let keepAliveModuleName = (this.activeTab.keepAliveModuleName).toLocaleUpperCase();
            // 初始化的状态
            if (!this.actived) {
              
              if (/NEW/.test(keepAliveModuleName)) {
                // 删除空值
                

                if (isEmpty(val)) {
                  delete ParentForm.formData[this.items.colname]
                }
                ParentForm.formChangeData = JSON.parse(JSON.stringify(ParentForm.formData));
                //console.log(JSON.stringify(ParentForm.formChangeData),'NEW');
              }
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
                }
                
                
              }else{
                //详情明细  有值 
                ParentForm.formChangeData = Object.assign({}, ParentForm.formChangeData, current_data)
                
                if (JSON.stringify(val) === JSON.stringify(this.defaultVale)) {
                  delete ParentForm.formChangeData[this.items.colname]
                  delete ParentForm.formChangeDataLabel[this.items.colname]
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


          if (ParentForm.$parent.formPanelChange) {
            ParentForm.$parent.formPanelChange(ParentForm.formChangeData, ParentForm.formDatadefault)
          }else{
            ParentForm.$parent.formChange(ParentForm.formChangeData, ParentForm.formDatadefault)
          }




        }

      }
    }
  },
  mounted() {
    this.defaultVale = new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items))).defaultDataProcessing() || '';
  }
};