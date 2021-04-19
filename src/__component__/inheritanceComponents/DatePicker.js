/**
 * DatePicker组件的自定义逻辑处理
 */
import Vue from 'vue';
// import { DatePicker } from 'ark-ui';
import dataProp from '../../__config__/props.config';
import { SetPlaceholder } from './setProps';

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

    let _that = this
    // 处理type
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

    // 处理单对象界面options
    if(this.item.detailType){
      defaultProps.options = {
        default: () => ({
          disabledDate(date){
            switch(_that.item.webconf && _that.item.webconf.datelimit){
              case 'before':
                return date && date.valueOf() > new Date().valueOf();
              case 'after':
                return date && date.valueOf() < new Date().valueOf() - 1 * 24 * 60 * 60 * 1000;
              case 'beforetoday':
                return (
                  date
                  && date.valueOf() > new Date().valueOf() - 1 * 24 * 60 * 60 * 1000
                );
              case 'aftertoday':
                return (
                  date
                  && date.valueOf() < new Date().valueOf()
                );
              default:
                break;
            }
          }
        })
      };
    }
    

    defaultProps.transfer = {
      default: () => true
    };
    defaultProps.disabled = {
      default:() => this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true)
    }
    defaultProps.vModelFormat = {
      default:() => true
    }

    defaultProps.format = {
      default:() => {
        switch (this.item.display) {
          case 'OBJ_DATE':
            return 'yyyy-MM-dd HH:mm:ss';
            break;
          case 'OBJ_DATENUMBER':
            return 'yyyy-MM-dd';
            break;
          case 'YearMonth':
            return 'yyyy-MM'
            break;
          case 'OBJ_DATETIME':
            return 'yyyy-MM-dd HH:mm:ss';
            break;
          case 'OBJ_TIME':
            return 'yyyy-MM';
            break;
          default:
            return 'yyyy-MM-dd';
            break;
        }
      }
    }

    const placeholder = {
      default: () => new SetPlaceholder(this.item).init()
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
