/**
 * DatePicker组件的自定义逻辑处理
 */
import Vue from 'vue';
import { DatePicker } from 'ark-ui';
import dataProp from '../../__config__/props.config';

class CustomDatePicker {
  constructor(item) {
    this.item = item;
    const DateInput = Vue.extend(DatePicker);
    this.DatePicker = new DateInput().$options;
    delete this.DatePicker._Ctor;
  }

  init() {
    this.mergeProps();
    // this.mergeMethods();
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
          default:
            return 'date';
            break;
        }
      }
    };
    defaultProps.transfer = {
      default: () => true
    };
    const placeholder = {
      default: () => '测试'
    };

    defaultProps.placeholder = placeholder;
    this.DatePicker.props = defaultProps;
    // this.DatePicker._Ctor[0].options.props  = Object.assign(this.DatePicker._Ctor[0].options.props,defaultProps);
    // this.DatePicker._Ctor[0].options.mixins.props  = Object.assign(this.DatePicker._Ctor[0].options.props,defaultProps);
  }

  mergeMethods() {
    console.log(this.DatePicker.mixins[0]);
    const test = this.DatePicker.mixins[0].methods.handleClose;
    this.DatePicker.mixins[0].methods.handleClose = function () {
      console.log(this);

      test().bind(this);
    };
  }
}

export default CustomDatePicker;
