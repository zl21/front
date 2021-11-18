/**
/**
 * MonthDay日月的日期组件的自定义逻辑处理
 */
import { SetDisable, SetPlaceholder } from './setProps'

let MonthDay = Ark.MonthDay

class CustomMonthDay {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(MonthDay)
    this.mergeProps()
  }

  init() {
    return {
      Components: this.Vm,
      props: this.props,
    }
  }

  // 合并props
  mergeProps() {
    this.props = {
      format: 'MM-dd',
      disabled: new SetDisable(this.item).init(),
      placeholder:new SetPlaceholder(this.item).init(),
    }
  }
}

export default CustomMonthDay
