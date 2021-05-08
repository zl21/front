/**
/**
 * DatePicker组件的自定义逻辑处理
 */
import Vue from 'vue';
// import { DatePicker } from 'ark-ui';
import dataProp from '../../__config__/props.config';
import { SetPlaceholder ,SetDisable} from './setProps';

let DatePicker = Ark.DatePicker;
let TimePicker = Ark.TimePicker;
class CustomDatePicker {
  constructor(item) {
    this.item = item;
    this.Vm = this.item.display === 'OBJ_TIME'?TimePicker:DatePicker;
    this.mergeProps();   
    this.mergeMethods(); 
  }

  init() {
    return {
      Components:this.Vm,
      props:this.props
    };
  }

  // 合并props
  mergeProps() {
    this.props={
      placeholder:new SetPlaceholder(this.item).init(),
      vModelFormat:true,
      disabled:new SetDisable(this.item).init(),
      transfer:true,
      type:this.type(),
      format:this.format()
    }
    let _that = this;

    // 处理单对象界面options
    if(this.item.detailType){
      this.props.options =  {disabledDate(date){
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
      }}
    }
  }
  type(){
    switch (this.item.display) {
      case 'OBJ_DATE':
        return 'datetimerange';
        break;
      case 'OBJ_DATENUMBER':
        if(this.item.detailType){
          return 'date';
        }else{
          return 'datetimerange';
        }
        break;
      case 'YearMonth':
        return 'month'
        break;
      case 'OBJ_DATETIME':
        if(this.item.rangecolumn){
          return 'datetimerange';
        }
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
  format(){
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
        return 'HH:mm:ss';
        break;
      default:
        return 'yyyy-MM-dd';
        break;
    }

  }
  mergeMethods() {
    this.Vm.mounted= function(){
      this.onSelectionModeChange(this.type)
    }
  }
}

export default CustomDatePicker;
