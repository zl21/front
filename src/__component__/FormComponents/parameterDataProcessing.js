/* eslint-disable consistent-return */

/**
   *处理表单数据格式
   *
   * @returns
   * @memberof ParameterDataProcessing
   * 
   * @field 字段名
   * @value 需要处理的数据值
   */

export default class ParameterDataProcessing {
  constructor(item, value) {
    this.item = item;
    this.value = value;
  }
  /**
   *处理表单抛出去的传参数据格式
   *
   * @returns
   * @memberof dataProcessing
   */
  dataProcessing() { 
    // eslint-disable-next-line func-names
    // 类型判断
    const Type = (function () {
      const Type = {};
      // eslint-disable-next-line no-cond-assign
      for (let i = 0, type; type = ['Undefined', 'Null', 'Boolean', 'Number', 'String', 'Function', 'Array', 'Object'][i++];) {
        // eslint-disable-next-line func-names
        (function (type) {
          // eslint-disable-next-line func-names
          Type[`is${type}`] = function (obj) {
            return Object.prototype.toString.call(obj) === `[object ${type}]`;
          };
        }(type));
      }
      return Type;
    }());

    if (!this.value) { // 过滤空数据字段
      return {
        [this.item.colname]: this.value
      };
    }

    // 处理空数组和存在值为''的数据
    if (Type.isArray(this.value) && (this.value.length === 0 || !this.value[0])) {
      return {};
    }

    // 处理select合并字段
    if (this.item.conds && this.item.colname.includes('R3_index_')) {
      // eslint-disable-next-line no-unused-expressions
      Type.isArray(this.value) ? null : this.value = new Array(this.value);
      const obj = this.value.reduce((json, item) => {
        if (json[item.split('|')[0]]) {
          json[item.split('|')[0]].push(item.split('|')[1]);
        } else {
          json[item.split('|')[0]] = [item.split('|')[1]];
        }
        
        return json;
      }, {});
      return obj;
    }

    // 处理外健关联字段
    if (this.item.display === 'OBJ_FK' && ['mrp', 'drp', 'pop', 'mop'].includes(this.item.fkobj.searchmodel)) {
      if (Type.isArray(this.value)) { // 处理外健选中时的传参
        
        if (this.item.fkobj.searchmodel === 'mop') {
          return {
            [this.item.colname]: this.value[0].ID
          };
        }
        return {
          [this.item.colname]: this.value.map(item => item.ID).join(',')
        };
      } // 外健模糊搜索时的传参
      return {
        [this.item.inputname]: this.value
      };
    }

    // 处理日期字段
    if (['OBJ_DATE', 'OBJ_DATENUMBER','YearMonth', 'OBJ_DATETIME'].includes(this.item.display)) {
      
      let arr = [];
      if (this.item.display === 'OBJ_DATE') {
        arr = [new Date().r3Format(new Date(this.value[0]), 'yyyy/MM/dd hh:mm:ss'), new Date().r3Format(new Date(this.value[1]), 'yyyy/MM/dd hh:mm:ss')];
      }  
      if(this.item.display === 'OBJ_DATENUMBER'){
        arr = [new Date().r3Format(new Date(this.value[0]), 'yyyyMMdd'), new Date().r3Format(new Date(this.value[1]), 'yyyyMMdd')];
      }
      if(this.item.display === 'YearMonth'){
        arr = [new Date().r3Format(new Date(this.value), 'yyyy-MM')];
      }
      if(this.item.display === 'OBJ_DATETIME'){
        arr = [new Date().r3Format(new Date(this.value), 'yyyy-MM-dd')];
      }

      return {
        [this.item.colname]: arr.join('~')
      };
    }

    // 处理select组件
    if(this.item.display === 'OBJ_SELECT'){
      if(this.value.includes('bSelect-all')){
        return {}
      }
    }
    return {
      [this.item.colname]: this.value
    };
  }

  /**
   *处理表单默认数据
   *
   * @returns
   * @memberof defaultDataProcessing
   */
  defaultDataProcessing() {
    
    // select
    if ((this.item.default || this.item.defval) && this.item.display === 'OBJ_SELECT') {
      return this.item.default?this.item.default.split(','):this.item.defval;
    }

    // fk外健
    if (this.item.display === 'OBJ_FK') {
      if (['mrp', 'drp', 'pop', 'mop'].includes(this.item.fkobj.searchmodel) && (this.item.refobjid && this.item.refobjid != '-1')) {
        let arr = []
        if(this.item.fkobj.searchmodel === 'mop'){
          arr.push({
            ID: this.item.refobjid.split(','),
            Label: this.item.default ? this.item.default : this.item.valuedata
          })
        }else{
          this.item.refobjid.split(',').map((item,index) => {
            arr.push({
              ID: item,
              Label: this.item.default ? this.item.default.split(',')[index] : this.item.valuedata
            })
          })
        }
        
        return arr
      }

      return '';
    }

    // 处理日期控件的默认值问题,区分列表还是单对象默认值
    if(this.item.daterange && !this.item.default){
      this.item.default = this.item.daterange
    }
    if (this.item.default && ['OBJ_DATENUMBER','OBJ_DATE','YearMonth'].includes(this.item.display) && ((this.item.default && this.item.default !== '-1') || this.item.customDefault)) {
      if(this.item.customDefault){
        return this.item.customDefault
      }
      if(this.item.display === 'YearMonth'){
        return this.item.default;
      }
      const dateArray = [];
      dateArray[0] = new Date().r3Format(new Date().minusDays(Number(this.item.default)), 'yyyy-MM-dd 00:00:00');
      dateArray[1] = new Date().r3Format(new Date(), 'yyyy-MM-dd 23:59:59');
      return dateArray;
    }else if(['OBJ_DATENUMBER','OBJ_DATE','YearMonth','OBJ_DATETIME'].includes(this.item.display) && this.item.valuedata){
      return this.item.valuedata
    }

    // 处理图片,文档默认值,转json
    if(this.item.valuedata && ['image','OBJ_DOC'].includes(this.item.display)){
      return JSON.parse(this.item.valuedata)
    }



    // 处理checkbox
    if(this.item.display === 'OBJ_CHECK'){
      if(!this.item.valuedata){
        return this.item.combobox.filter(item => !item.limitdis)[0].limitval
      }
    }
    





    return this.item.default || this.item.valuedata || this.item.defval;
  }

}







