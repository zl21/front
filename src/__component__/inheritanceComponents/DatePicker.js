/**
 * DatePicker组件的自定义逻辑处理
 */
import Vue from 'vue';
// import { DatePicker } from 'ark-ui';
import dataProp from '../../__config__/props.config';

let DatePicker = Ark.DatePicker;
let TimePicker = Ark.TimePicker;
class CustomDatePicker {
  constructor(item) {
    this.item = item;
    const DateInput = Vue.extend(this.item.display === 'OBJ_TIME'?TimePicker:DatePicker);
    this.DatePicker = new DateInput().$options;
    delete this.DatePicker._Ctor;
  }

  init() {
    this.mergeProps();
    this.mergeMethods();
    // if (this.item.Components) {
    //   return this.item.Components;
    // }
   
    // console.log(new Con().$options,'1212');
    if (this.item.Components) {
      return this.item.Components;
    }
    const Con = Vue.extend(this.DatePicker);
    
    const obj = { ...new Con().$options };
    this.item.Components = obj;
    // this.item.Components = obj;
    return obj;
  }

  // 合并props
  mergeProps() {
    const defaultProps = { ...this.DatePicker.props };

    defaultProps.type = {
      default: () => {
        switch (this.item.display) {
          case 'OBJ_DATE':
            return 'datetimerange';
            break;
          case 'OBJ_DATENUMBER':
            return 'daterange';
            break;
          case 'YearMonth':
            return 'month'
            break;
          case 'OBJ_DATETIME':
            return 'datetime';
            break;
          case 'OBJ_TIME':
            return 'time';
            break;
          default:
            return 'date';
            break;
        }
      }
    };
    defaultProps.transfer = {
      default: () => true
    };
    defaultProps.disabled = {
      default:() => this.item.readonly
    }

    const placeholder = {
      default: () => `请选择${this.item.coldesc}`
    };

    defaultProps.placeholder = placeholder;
    this.DatePicker.props = defaultProps;
  }

  mergeMethods() {

    this.DatePicker.mounted[1]= function(){
      this.onSelectionModeChange(this.type)
    }
  }
}

export default CustomDatePicker;
