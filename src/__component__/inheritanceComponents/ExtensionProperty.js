/**
 * 扩展属性组件的自定义逻辑处理
 */
import { ExtensionProperty } from '@syman/ark-ui-bcl'
// import ExtensionProperty from 'arkui_BCL/ExtensionProperty'
import network from '../../__utils__/network'
import { SetDisable } from './setProps'
class CustomExtensionProperty {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(ExtensionProperty)
    this.mergeProps()
    this.mergeMethods()
  }

  init() {
    return {
      Components: this.Vm,
      props: this.props,
    }
  }
  // 合并props
  mergeProps() {
    const props = {
      ...this.item,
      disabled: new SetDisable(this.item).init(),
      defaultData: this.item.valuedata || {},
      network,
      ctrlOptions: this.item.ctrlOptions || { rows: 8 },
      webconf: {
        ...this.item,
      },
    }

    this.props = props
  }

  // 合并methods
  mergeMethods() {}
}

export default CustomExtensionProperty
