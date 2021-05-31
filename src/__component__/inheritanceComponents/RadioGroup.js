import RadioGroup from '../form/RadioGroup.vue'
import { SetDisable } from './setProps'

class CustomRadioGroup {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(RadioGroup)
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

export default CustomRadioGroup
