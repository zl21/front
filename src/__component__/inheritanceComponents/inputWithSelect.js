import { SetDisable } from './setProps';
import InputWithSelect from '../form/InputWithSelect.vue'


class CustomInputWithSelect {
  constructor(item) {
    this.item = item;
    this.Vm = Object.create(InputWithSelect);
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
    this.props = {
      trueValue:this.item.trueValue,
      falseValue:this.item.falseValue,
      disabled:new SetDisable(this.item).init(),
      webconf:this.item.webconf,
      clearable: true,
      item: this.item,
    }
  }

  // 合并methods
  mergeMethods() {

  }
}

export default CustomInputWithSelect;