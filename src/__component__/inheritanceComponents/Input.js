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
    this.instance = Object.create(Input)
    this.mergeProps()
    this.mergeMethods()
  }

  init() { 
    return {
      Components: this.instance,
      props: this.props,
    }
  }

  // 合并props
  mergeProps() {
    this.item.props = this.item.props || {}
    this.props = {
      maxlength: this.item.length,
      item:this.item,
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
    this.props.clearable = this.item.clearable
    this.props.autofocus = this.item.autofocus
    this.props.size = this.item.size
    this.props.icon = this.item.icon

    // console.log(this.instance)
  }

  // 合并methods
  mergeMethods() {
     new InputMethod(this.item, this.instance)

    // this.instance.methods.nextInputFocus = this.nextInputFocus
    // this.overrideKeyDown()
  }

  numericTypes() {
    // 数字类型输入控制
    // 只能输入 正整数
    let string = ''
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

  // 重写按下键盘事件
  overrideKeyDown() {
    const keyDownFn = this.instance.methods.handleKeydown;
    const isDetailPage = this.item.detailType
    this.instance.methods.handleKeydown = function(e) {
      console.log(this,'1111');
       // 禁止输入特殊字符 '
      if ([222].includes(e.keyCode)) {
        e.stopPropagation();
        e.preventDefault();
      }

      // 明细界面的input，按下回车后，光标自动移到下一个Input框里
      if(isDetailPage && e.keyCode === 13) {
        const currentWrapDom = this.$parent.$parent.$el.parentNode // 当前组件的容器节点
        this.nextInputFocus.call(this, currentWrapDom)
      }
      keyDownFn.call(this,...arguments)
    }
  }

  // 获取焦点
  nextInputFocus(currentWrapDom) {
    // 当前节点是textarea就不触发后面的逻辑。而是直接换行
    if(currentWrapDom) {
      const textarea = currentWrapDom.querySelector('textarea')
      if(textarea) {
        return
      }
    }

    const nextItemDom = currentWrapDom.nextElementSibling // 下一个兄弟节点
    if(!nextItemDom) {
      return
    }
    const inputDom = nextItemDom.querySelector('.ark-input')
    if(!inputDom || nextItemDom.style.display === 'none' || (inputDom && inputDom.disabled)|| (inputDom && inputDom.type === 'checkbox')) {
      // 继续查找下个节点
      this.nextInputFocus(nextItemDom)
    } else {
      inputDom.focus()
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
