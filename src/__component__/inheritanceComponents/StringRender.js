import StringRender from '../form/StringRender.vue'
import { SetDisable } from './setProps'

class CustomStringRender {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(StringRender)
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
      customizedDefaultValue: '',
      options: { 
        ...this.item,
        disabled: new SetDisable(this.item).init()
      },
    }
  }

  mergeMethods() {}
}

export default CustomStringRender
