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

 import { Version } from '../../constants/global'
 import i18n from '../../assets/js/i18n'
 import { enableKAQueryDataForUser } from '../../constants/global'

function get_default_datenumber(formItem, isDetailPage) {
  // 单对象界面
  if(isDetailPage) {
    return formItem.valuedata || formItem.defval || '';
  } else {
    // 列表界面
    let timeRange = ''
    if (formItem.customDefault) {
      timeRange = [
        `${new Date().r3Format(new Date(formItem.customDefault[0]), 'yyyy/MM/dd hh:mm:ss')}`,
        `${new Date().r3Format(new Date(formItem.customDefault[1]), 'yyyy/MM/dd hh:mm:ss')}`
      ];
      return timeRange;
    }
  
    if (formItem.default && formItem.default !== '-1') {
      timeRange = [
        new Date().setNewFormt(new Date().minusDays(Number(formItem.default)).toIsoDateString(), '-', ''),
        new Date().setNewFormt(new Date().toIsoDateString(), '-', '')
      ];
      return timeRange;
    }
    return timeRange;
  }
}

function get_default_date(formItem, isDetailPage) {
  if(isDetailPage) {
    if(formItem.rangecolumn) {
      const start = formItem.rangecolumn.upperlimit;
      const end = formItem.rangecolumn.lowerlimit;
      return [start.defval || start.valuedata, end.defval || end.valuedata];
    }
    const value = formItem.valuedata || formItem.defval;
    return value ? `${new Date().r3Format(new Date(value), 'yyyy-MM-dd hh:mm:ss')}`: '';
  } else {
    let timeRange = ''
    if (formItem.customDefault) {
      timeRange = [
        `${new Date().r3Format(new Date(formItem.customDefault[0]), 'yyyy/MM/dd hh:mm:ss')}`,
        `${new Date().r3Format(new Date(formItem.customDefault[1]), 'yyyy/MM/dd hh:mm:ss')}`
      ];
      return timeRange;
    }

    if (formItem.default !== '-1') {
      // default值为-1，没有默认值
      // default值为0，查询当天
      // default值为2，查询近2天
      timeRange = [
        `${new Date().setNewFormt(new Date()
          .minusDays(Number(formItem.daterange))
          .toIsoDateString(), '-', '/')} 00:00:00`,
        `${new Date().setNewFormt(new Date().toIsoDateString(), '-', '/')} 23:59:59`
      ];
      return timeRange;
    }
    return timeRange;
  }
}

// 获取用户id
function getUserId() {
  const userJson = localStorage.getItem('userInfo') || ''
  let user = {}
  if (userJson) {
    user = JSON.parse(userJson)
  }
  return user.id
}

// 获取inputWithSelect选项
export function getSelectOption(colname, tableName) {
  const userId = getUserId()
  const json = localStorage.getItem(`${userId}_${tableName}_${colname}`) || ''
  return json
}

export function get_default_InputWithSelect(val, selectValue) {
  let value = val || ''
  switch (selectValue) {
    case 'all':
      break
    case 'equal':
      if (value) {
        let valueArr = [] // 存储含空格的字符
        let valueArr2 = [] // 存储含逗号的字符
        if (Array.isArray(value)) {
          value = value.map(item => item.replace(/=/g, ''))
          value = value.join(',')
        }
        value = value.trim()
        value = value.split(' ')
        // 例如11 22 33,44  55,66
        for (let i = 0; i < value.length; i++) {
          let element = value[i].trim()
          if (element && !element.includes(',')) {
            valueArr.push(`=${element}`)
          }
          if (element && element.includes(',')) {
            valueArr2.push(element)
          }
        }
        // 需要进一步分割含逗号的
        valueArr2 = valueArr2.join(',').split(',')
        for (let j = 0; j < valueArr2.length; j++) {
          const ele = valueArr2[j].trim()
          if (ele) {
            valueArr.push(`=${ele}`)
          }
        }
        value = valueArr
      }
      break
    case 'isNotNull':
      value = 'is not null'
      break
    case 'isNull':
      value = 'is null'
      break

  }
  return value
}
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
    if (['OBJ_DATE', 'OBJ_DATENUMBER', 'YearMonth', 'OBJ_DATETIME'].includes(this.item.display)) {
      let arr = [];    
      if (this.item.rangecolumn) {
        arr = [new Date().r3Format(new Date(this.value[0]), 'yyyy/MM/dd hh:mm:ss'), new Date().r3Format(new Date(this.value[1]), 'yyyy/MM/dd hh:mm:ss')];
        return {
          [this.item.colname]: arr.join('~')
        };
      }
      if (this.item.display === 'OBJ_DATE') {
        if(Version() === '1.3') {
          return {
            [this.item.colname]: this.value.join('~')
          };
        } else {
          if (this.item.default !== '-1') {
            // default值为-1，没有默认值
            // default值为0，查询当天
            // default值为2，查询近2天
            if(this.value){
              arr = this.value;
            }else{
              arr = [
                `${new Date().setNewFormt(new Date()
                  .minusDays(Number(this.item.daterange))
                  .toIsoDateString(), '-', '/')} 00:00:00`,
                `${new Date().setNewFormt(new Date().toIsoDateString(), '-', '/')} 23:59:59`
              ];
            }
          } 
          if(this.item.customDefault) {
            const format = 'yyyy/MM/dd hh:mm:ss'
            arr = [new Date().r3Format(new Date(this.value[0]), format), new Date().r3Format(new Date(this.value[1]), format)];
          }
          if(this.item.default === '-1'){
            if(this.value){
              arr = [new Date().r3Format(new Date(this.value[0]), 'yyyy/MM/dd hh:mm:ss'), new Date().r3Format(new Date(this.value[1]), 'yyyy/MM/dd hh:mm:ss')];
            }
          }
        }
        
      }
      
      if (this.item.display === 'OBJ_DATENUMBER') {
        if (this.item.rangecolumn || !this.item.detailType) {
          arr = [new Date().r3Format(new Date(this.value[0]), 'yyyyMMdd'), new Date().r3Format(new Date(this.value[1]), 'yyyyMMdd')];
        }else{
          arr = [new Date().r3Format(new Date(this.value), 'yyyyMMdd')];
        }
      }
      if (this.item.display === 'YearMonth') {
        arr = [new Date().r3Format(new Date(this.value), 'yyyy-MM')];
      }
      if (this.item.display === 'OBJ_DATETIME') {
        const format = this.item.detailType? 'yyyy-MM-dd hh:mm:ss': 'yyyy/MM/dd hh:mm:ss'
        arr = [new Date().r3Format(new Date(this.value), format)];
      }

      return {
        [this.item.colname]: arr.join('~')
      };
    }



    // 处理select组件
    if (this.item.display === 'OBJ_SELECT') {
      if (this.value.includes('bSelect-all')) {
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
    const isDetailPage = this.item.detailType // 是否是单对象界面

    if (this.item.defval) {
      //  兼容默认值defval 是单对象默认值， default 是列表默认值   valuedata:是单对象的值
      this.item.default = this.item.defval
    }
    // select
    if ((this.item.default || this.item.defval) && this.item.display === 'OBJ_SELECT') {
      // detailType为真，说明是单对象
      // return this.item.default ? this.item.default.split(',') : this.item.defval;
      if(this.item.valuedata){
        let index = this.setSelectedValue(this.item);
        if(index<0 && isDetailPage){
            return ''
        }
        return this.item.valuedata;
      }else if(this.item.default){
        if(!isDetailPage && typeof this.item.default === 'string'){
          return this.item.default.split(',');
        }
        let index = this.setSelectedValue(this.item);
        if(index<0 && isDetailPage){
            return ''
        }
        return this.item.default;
      }
     
    }
    // 
    if(this.item.display === 'OBJ_SELECT' && isDetailPage){
      let index = this.setSelectedValue(this.item);
      if(index<0){
          return ''
      }

    }

    // fk外健

    if (this.item.display === 'OBJ_FK') {
      

      let fkobj = this.item.fkobj.searchmodel || this.item.fkdisplay;
      if (['mop'].includes(fkobj) && this.item.valuedata && /total/.test(this.item.valuedata)) {
        const valuedata = JSON.parse(this.item.valuedata);

        return [
          {
            Label: i18n.t('messages.selectedItem',{total:valuedata.total}) || '',
            ID: this.item.valuedata
          }
        ]
      }else{
        if (['mrp', 'drp', 'pop', 'mop'].includes(fkobj) && (this.item.refobjid && this.item.refobjid != '-1' && this.item.refobjid!='0')) {
          let arr = []
          // 多选change
          const refobjid = (this.item.refobjid.toString() || '').split(',') || [];
          const valuedata = (this.item.valuedata ? this.item.valuedata :this.item.default || '').split(',') || [];
          if (refobjid.length > 0) {
            arr = refobjid.reduce((currty, itemI, index) => {
              currty.push({
                ID: itemI || '',
                Label: valuedata[index] || ''
              });
              return currty;
            }, []);
          }else{
            arr.push({
              ID: valuedata,
              Label: valuedata
            });
          }

          return arr
        }

      }
      
      

      // return '';
    }

    // 处理日期控件的默认值问题,区分列表还是单对象默认值
    // daterange和default值一定是一样的，但有时接口不会返回daterange
    if (this.item.daterange && !this.item.default) {
      this.item.default = this.item.daterange
    }

    switch(this.item.display) {
      case 'OBJ_DATENUMBER': 
        return get_default_datenumber(this.item, isDetailPage)
      case 'OBJ_DATE': 
      case 'OBJ_DATETIME':
        return get_default_date(this.item, isDetailPage)
      case 'OBJ_TIME': 
        return this.item.valuedata || this.item.defval || '';
      case 'YearMonth': 
        return this.item.valuedata || this.item.default  || ''
      default:
        break
    }

    // if (this.item.default && ['OBJ_DATENUMBER', 'OBJ_DATE', 'YearMonth'].includes(this.item.display) && ((this.item.default && this.item.default !== '-1') || this.item.customDefault)) {
    //   // 设置默认值
    //   if (this.item.daterange) {
    //     const timeRange = [
    //       new Date().r3Format(new Date().minusDays(Number(this.item.daterange)), 'yyyy-MM-dd 00:00:00'),
    //       new Date().r3Format(new Date(), 'yyyy-MM-dd 23:59:59')
    //     ];

    //     return timeRange;
    //   }
    //   if (this.item.customDefault) {
    //     return this.item.customDefault
    //   }
    //   if (this.item.display === 'YearMonth') {
    //     return this.item.default;
    //   }


    // } else if (['OBJ_DATENUMBER', 'OBJ_DATE', 'YearMonth', 'OBJ_DATETIME'].includes(this.item.display) && this.item.valuedata) {
    //   return this.item.valuedata || this.item.defval
    // }
    // if (this.item.rangecolumn && this.item.display === "OBJ_DATETIME") {
    //   const start = this.item.rangecolumn.upperlimit;
    //   const end = this.item.rangecolumn.lowerlimit;
    //   return [start.valuedata || start.default, end.valuedata || end.default];
    // }

    // 处理图片,文档默认值,转json

    if (this.item.valuedata && ['image', 'OBJ_DOC'].includes(this.item.display)) {
      let _value = this.item.valuedata || this.item.defval;
      try {
        if(Array.isArray(JSON.parse(_value)) ){
          return JSON.parse(_value)
        }else{
          return [_value]
        }
        
      } catch (error) {
        return [{
          URL:_value,
          NAME:''
        }]
      }
    }



    // 处理checkbox
    if (this.item.display === 'OBJ_CHECK') {
      let value = this.item.valuedata || this.item.default;
      if (value) {
        return this.item.combobox.filter(item => {
          return item.limitval = value;
        })[0].limitval
      }
      return this.item.falseValue;
    }
    
    // 处理inputWithSelect
    if(this.item.display === 'InputWithSelect') {
      let selectValue = this.item.webconf.inputWithSelectOption
      if (enableKAQueryDataForUser() || this.item.enableKAQueryDataForUser) {
        this._tableName = this.item._id
        this._colname = this.item.colname
        const option = getSelectOption(this._colname, this._tableName)
        if (option) {
          selectValue = option
        }
      }
      const value = get_default_InputWithSelect(this.item.default, selectValue)
      return value
    }
    return this.item.valuedata || this.item.default ;
  }


  /**
   *处理表单label
   *
   * @returns
   * @memberof getLable
   */

  getLable() {
    if (this.item.display === 'OBJ_SELECT') {
      const optionIndex = this.item.combobox.findIndex(x => x.value === this.value);
      if (optionIndex !== -1) {
        return this.item.combobox[optionIndex].limitdesc;
      } else {
        return ''
      }

    }
   
    if (this.item.display === 'OBJ_CHECK') {
      const optionIndex = this.item.combobox.findIndex(x => x.limitval === this.value);
      if (optionIndex !== -1) {
        return this.item.combobox[optionIndex].limitdesc;
      } else {
        return this.item.falseLabel;
      }

    }

    if (Array.isArray(this.value)) {
      if (this.value[0] && this.value[0].ID) {
        return this.value.reduce((arr, Item) => {
          arr.push(Item.Label);
          return arr;
        }, []).join(',');
      }
    }else{
      return this.value
    }

  }

   /**
   *处理select
   *
   * @returns
   * @memberof setSelectedValue
   */

   setSelectedValue(item) {
    let value = item.valuedata || item.default;
    // let disabled = item.readonly  &&  (item.webconf ? !item.webconf.ignoreDisableWhenEdit : true);
    // if(disabled){
    //   return 1;
    // }
    const optionIndex = this.item.combobox.findIndex(x => x.value === value);
    return optionIndex;


  }
}

 