/**
 * Input 组件自定义
 *
 */
import InputMethod from '../ExtendedMethods/Input'
import { SetPlaceholder, SetDisable } from './setProps'

let Input = Ark.Input

// const nativeInput = deepClone(Input);
class CustomInput {
  constructor(item) {
    this.item = item
    this.Vm = Object.create(Input)
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
    this.item.props = this.item.props || {}
    this.props = {
      maxlength: this.item.length,
      placeholder: new SetPlaceholder(this.item).init(),
      disabled: new SetDisable(this.item).init(),
    }

    if (this.item.isuppercase) {
      this.uppercase()
    }
    if (this.item.type === 'NUMBER') {
      this.numericTypes()
    }
    if (this.item.props.regx) {
      this.props.regx = this.item.props.regx
    }

    if (this.item.display === 'OBJ_TEXTAREA') {
      this.props.type = 'textarea'
      if (
        (this.item.webconf && this.item.webconf.ispassword) ||
        this.item.ispassword
      ) {
        this.props.encrypt = true
      }

      this.props.autosize = {
        minRows: this.item.row + 1,
      }
    } else {
      // 处理ispassword属性

      if (
        (this.item.webconf && this.item.webconf.ispassword) ||
        this.item.ispassword
      ) {
        this.props.type = 'password'
      }
    }

    // disabled和readonly的值需要保持一致
    this.props.readonly = this.props.disabled

    this.props.rows = this.item.row || 1
    this.props.maxlength = this.item.length
    this.props.clearable = this.item.clearable
    this.props.autofocus = this.item.autofocus
    this.props.size = this.item.size
    this.props.icon = this.item.icon

    // console.log(this.Vm)
  }

  // 合并methods
  mergeMethods() {
    new InputMethod(this.item, this.Vm)
  }

  numericTypes() {
    // 数字类型输入控制
    // 只能输入 正整数
    let string = ''
    this.item.length = 100

    if (this.item.webconf && this.item.webconf.ispositive) {
      string = `^\\d{0,${this.item.length}}(\\\.[0-9]{0,${this.item.scale}})?$`
    } else {
      string = `^(-|\\+)?\\d{0,${this.item.length -
        this.item.scale}}(\\\.[0-9]{${this.item.scale - 1},${
        this.item.scale
      }})?$`
    }

    const typeRegExp = new RegExp(string)
    if (this.item.scale >= 0) {
      this.item.props.regx = typeRegExp
    } else if (this.item.webconf && this.item.webconf.ispositive) {
      this.item.props.regx = typeRegExp
    }
  }

  uppercase() {
    // 大写转换
    if (this.item.isuppercase) {
      this.item.props.regx = /^[A-Z0-9\u4e00-\u9fa5]*$/
    }
  }
}

export default CustomInput
