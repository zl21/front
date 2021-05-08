/**
/**
 * checkbox组件的自定义逻辑处理
 */
import Vue from 'vue';
import { SetDisable } from './setProps';


let Checkbox = Ark.Checkbox

class CustomCheckbox {
  constructor(item) {
    this.item = item;
    this.Vm = Checkbox;
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
    this.settingOptions();

    console.log(this.props,this.item.props);

    this.props = {
      trueValue:this.item.trueValue,
      falseValue:this.item.falseValue,
      disabled:new SetDisable(this.item).init(),
    }
    console.log(this.props,this.item.props);

    
  }

  // 合并methods
  mergeMethods() {

  }

  
  settingOptions() {
    if (this.item.combobox) {
      this.item.combobox.map((item) => {
        if(item.limitdis){
          this.item.trueValue = item.limitval
        }else{
          this.item.falseValue = item.limitval
        }
        return item;
      });
    }

  }
}

export default CustomCheckbox;