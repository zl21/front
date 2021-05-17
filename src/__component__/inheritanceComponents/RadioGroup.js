import RadioGroup from '../form/RadioGroup.vue'

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
        ...this.item
      },
    }
  }

  mergeMethods() {}
}

export default CustomRadioGroup
