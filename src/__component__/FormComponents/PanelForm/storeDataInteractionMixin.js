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
      hiddenChildTime:null, // 隐藏子表时间判断
    }
  },
  watch: {
    value: {
     async handler(val, old) {
        if (this.items.detailType) {
          let ParentForm = await  this.findParentForm();
          // 获取当前组件的值
          if(!ParentForm){
              return;
          }
          let current_value = ParentForm.dealData(this.items, val)[this.items.colname] || '';
          let current_data = {};
          // 1.3 label
          let R3Label = {
            [this.items.colname]:this.getLable()
          };
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
          // 转大写
          if(this.items.isuppercase){
            current_value = current_value.toLocaleUpperCase();
          }
          
          if(this.items.fkobj && (this.items.fkobj.searchmodel === 'pop' || this.items.fkobj.searchmodel === 'drp')){
           
            if (Version() === '1.4') {
              
              if (current_value === '') {
                current_value = 0;
              }
            }

          }
          if(this.items.fkobj && (this.items.fkobj.searchmodel === 'mrp')){
            current_value = (current_value ||'').split(',').map((item)=>{
              return item;
            }).sort(function(a,b){ return a-b}).join(',');
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
          // 兼容1.3
          if (Version() === '1.3') {
            if (isEmpty(current_value)) {
               current_value = null;
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
          ParentForm.formLabel[this.items.colname] = val; 
          let id = (ParentForm.defaultData.id || '').toString();  
          let keepAliveModuleName = this.activeTab.keepAliveModuleName && (this.activeTab.keepAliveModuleName).toLocaleUpperCase();
            // 初始化的状态
            if (!this.actived) {
              // 初始化默认值
              ParentForm.defaulDataValue = JSON.parse(JSON.stringify(ParentForm.formData));
              ParentForm.defaulDataLabel = Object.assign(JSON.parse(JSON.stringify(ParentForm.defaulDataLabel)),R3Label);
              if (isEmpty(val)) {
                // 删除空值
                delete ParentForm.formData[this.items.colname]
                delete ParentForm.defaulDataValue[this.items.colname]
                delete ParentForm.defaulDataLabel[this.items.colname]
              }

              this.InitializationForm(ParentForm);
              return;
            } else {
              // 页面修改

              if(this.items.rangecolumn){
                // 虚拟字段
                if (val[0] && val[1]) {
                  ParentForm.formChangeData[this.items.rangecolumn.upperlimit.colname] = val[0];
                  ParentForm.formChangeData[this.items.rangecolumn.lowerlimit.colname] = val[1];
                }else {
                  ParentForm.formChangeData[this.items.rangecolumn.upperlimit.colname] = '';
                  ParentForm.formChangeData[this.items.rangecolumn.lowerlimit.colname] = '';
                }
              }
              let IsModuleName = keepAliveModuleName.substr(keepAliveModuleName.lastIndexOf('.')+1);
              if (/.NEW/.test(IsModuleName) || id ==='-1') {
                // 新增  删除空值,且没有默认值     
                ParentForm.formChangeData = Object.assign({}, ParentForm.formChangeData, current_data);
                 // 虚拟区间不用传值
                if (this.items.rangecolumn) {
                  delete ParentForm.formData[this.items.colname];
                  delete ParentForm.formDatadefault[this.items.colname];
                  delete ParentForm.formChangeData[this.items.colname];
                }
                
                if (isEmpty(val) && isEmpty(this.defaultVale) ) {
                  // 新增的时候删除没有默认值的空值
                  delete ParentForm.formData[this.items.colname]
                  delete ParentForm.formChangeData[this.items.colname]
                  // delete ParentForm.defaulDataLabel[this.items.colname]

                  const data = {
                    key: this.items.colname,
                    itemName: this.items.tableName
                  };
                  
                  //删除新增有值后变空
                  ParentForm.deleteFormData(data)
                }
               
                // // 默认值
                // ParentForm.defaulDataValue = JSON.parse(JSON.stringify(ParentForm.formData));
                // ParentForm.defaulDataLabel = Object.assign(JSON.parse(JSON.stringify(ParentForm.defaulDataLabel)),R3Label);
                // this.InitializationForm(ParentForm)
                this.changeForm(ParentForm,val);
                return;
                
              }else{
                //详情明细  有值 
                ParentForm.formChangeData = Object.assign({}, ParentForm.formChangeData, current_data)
                ParentForm.formChangeDataLabel = Object.assign({}, ParentForm.formChangeDataLabel, R3Label)

                if (JSON.stringify(val) === JSON.stringify(this.defaultVale)) {
                  delete ParentForm.formChangeData[this.items.colname]
                  delete ParentForm.formChangeDataLabel[this.items.colname]
                   // 删除新增有值后变空
                   const data = {
                    key: this.items.colname,
                    itemName: this.items.tableName
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
              
              // 去除图片上传成功后的保存
              if (this.items.showPlace !== 'childrenForm'&& !ossRealtimeSave() && JSON.stringify(val) !== JSON.stringify(this.defaultVale)) {
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
            this.changeForm(ParentForm,val);
            
         

         
          



        }else{
          if (this.actived) {
            this.$emit('on-change',this.items,val )
          }
        }

      }
    }
  },
  methods:{
    InitializationForm(ParentForm){
      // 默认值
      ParentForm.initializationForm();
    },
    setTabPanels(val){
      // 新增修改
      let tabPanelsDom = document.querySelector(`#${this.activeTab.tableName}`);
      if(tabPanelsDom){
        let fkdisplay = this.items.fkobj && this.items.fkobj.fkdisplay;
        if(['drp','pop','mop'].includes(fkdisplay)){
          // 在单对象界面中外键字段必须有值
          if(!Array.isArray(val) && !isEmpty(val)){
            return;
          }
        }
        let display = this.items.display;
        if( this.items.webconf && this.items.webconf.display) {
          display =  this.items.webconf.display;
        }
        // 日期组件忽略
        if(['OBJ_DATENUMBER','OBJ_TIME','OBJ_DATE', 'YearMonth', 'OBJ_DATETIME','MonthDay'].includes(this.items.display)){
          return;
        }
     
        tabPanelsDom._vue_.setTabPanels();
      }
    },
    changeForm(ParentForm,val){
      // 修改后
      let formChangeData = ParentForm.formChangeData;
      let formDataLabel = ParentForm.formDataLabel;
      if(/New/.test(this.$route.params.itemId)){
        formChangeData = Object.assign(JSON.parse(JSON.stringify(ParentForm.defaulDataValue)),JSON.parse(JSON.stringify(formChangeData)));
        formDataLabel = Object.assign(JSON.parse(JSON.stringify(ParentForm.defaulDataLabel)),JSON.parse(JSON.stringify(formDataLabel)));
      }
      if (ParentForm.$parent.formPanelChange) {
        ParentForm.$parent.formPanelChange(formChangeData, formDataLabel,ParentForm.formChangeDataLabel)
      }else{
        ParentForm.$parent.formChange(formChangeData, formDataLabel,ParentForm.formChangeDataLabel)
      }
      clearTimeout(this.hiddenChildTime);
      this.hiddenChildTime = setTimeout(()=>{
        this.setTabPanels(val) 
      },500)
    }
  },
  async mounted() {
    let ParentForm = await this.findParentForm();
    this.defaultVale = new ParameterDataProcessing(JSON.parse(JSON.stringify(this.items))).defaultDataProcessing() || '';
      if(this.items.colname && ParentForm){
        if(ParentForm.formDataLabel && /NEW/.test(this.$route.params.itemId) === false){
          
          ParentForm.formDataLabel[this.items.colname] = this.defaultVale
        }
      }
   

    
  }
};
