import CheckboxGroup from '../form/CheckboxGroup.vue'
import { SetDisable } from './setProps'

class CustomCheckboxGroup {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(CheckboxGroup)
    this.mergeProps()
    this.mergeMethods()
  }

  init() {
    return {
      Components: this.Vm,
      props: this.props,
    }
  }

  mergeProps() {
    this.props = {
      value: this.item.valuedata,
      options: { 
        ...this.item,
        disabled: new SetDisable(this.item).init()
      },
    }
  }

  mergeMethods() {}
}

export default CustomCheckboxGroup
