import { SetPlaceholder, SetDisable } from './setProps'

let IconfontPicker = $Bcl.arkIconfontPicker

class CustomIconfontPicker {
  constructor(item) {
    this.item = item;
    this.Vm = Object.create(IconfontPicker);
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
    let value = ''
    if(this.item.valuedata) {
      value = JSON.parse(this.item.valuedata)
    }
    this.props = {
      placeholder: this.item.placeholder,
      disabled:new SetDisable(this.item).init(),
      transferJson: true,
      value: this.item.valuedata,
      icon: value.icon,
      color: value.color,
    }
  }

  // 合并methods
  mergeMethods() {

  }
}

export default CustomIconfontPicker;