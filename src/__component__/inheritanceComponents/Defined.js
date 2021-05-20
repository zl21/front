import Defined from '../Defined.vue'
import { SetDisable } from './setProps'

class CustomDefined {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(Defined)
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
      items: {
        ...this.item,
        disabled: new SetDisable(this.item).init(),
      }
    }
  }

  mergeMethods() {}
}

export default CustomDefined
