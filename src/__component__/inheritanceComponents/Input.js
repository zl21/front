/**
 * Input 组件自定义
 *
 */
import InputMethod from '../ExtendedMethods/Input'
import { SetPlaceholder, SetDisable } from './setProps'

let Input = Ark.Input

// 目前这个类支持改混入和方法，改其他属性推荐统一用混入改。后期要删除this.methods
class ComponentGenerator {
  constructor(protoComponent, options) {
    Object.keys(protoComponent).forEach((key) => {
      this[key] = Input[key]
    })
    delete this._Ctor // 不删除这个字段的话, this.methods和this.mixins就不会生效
    this.methods = { ...protoComponent.methods }
    this.mixins = [...protoComponent.mixins, options]
  }
}

const mixin = {
  props: {
    item: {
      type: Object,
    },
  },

  methods: {
    nextInputFocus(currentWrapDom) {
      // 当前节点是textarea就不触发后面的逻辑。而是直接换行
      if (currentWrapDom) {
        const textarea = currentWrapDom.querySelector('textarea')
        if (textarea) {
          return
        }
      }

      const nextItemDom = currentWrapDom.nextElementSibling // 下一个兄弟节点
      if (!nextItemDom) {
        return
      }

      const inputDom = nextItemDom.querySelector('.ark-input')
      if (
        !inputDom ||
        nextItemDom.style.display === 'none' ||
        (inputDom && inputDom.disabled) ||
        (inputDom && inputDom.readOnly) ||
        (inputDom && inputDom.type === 'checkbox')
      ) {
        // 继续查找下个节点
        this.nextInputFocus(nextItemDom)
      } else {
        inputDom.focus()
      }
    },
  },

  mounted() {
    this.$on('on-change', function(e) {
      if (!this.item || this.item.type !== 'NUMBER') {
        return
      }
      const value = event.target.value || ''
      const { webconf, scale, length } = this.item
      let valLength = length || 100
      let string = ''
      let regxString = ''

      if (valLength) {
        if (value.split('.').length > 1) {
          valLength = valLength + 1
        } else if (value.split('-').length > 1) {
          valLength = valLength + 1
        }
        if (value.split('.').length > 1 && value.split('-').length > 1) {
          valLength = valLength + 2
        }

        if (webconf && webconf.ispositive) {
          regxString = ''
        } else {
          regxString = '(-|\\+)?'
        }
        // 小数
        if (scale > 0) {
          string = `^${regxString}\\d{0,${valLength}}(\\\.[0-9]{0,${scale}})?$`
        } else {
          // string = `^${regxString}\\d{0,${valLength}}(\\\.[0-9])?$`
          // 整数
          string = `^${regxString}\\d{0,${valLength}}$`
        }
      }

      const itemComponent = this.$parent.$parent
      const typeRegExp = new RegExp(string)
      itemComponent.propsMessage.regx = typeRegExp
      itemComponent.propsMessage.maxlength = valLength
    })
  },
}
class CustomInput {
  constructor(item) {
    const instance = new ComponentGenerator(Input, mixin)

    this.instance = instance
    this.item = item
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
    const disabled = new SetDisable(this.item).init();
    this.props = {
      maxlength: this.item.length || 100,
      item: this.item,
      placeholder: new SetPlaceholder(this.item).init(),
      disabled,
      clearable: true
    }

    if(disabled) {
      this.props.clearable = false
    }

    if (this.item.isuppercase) {
      this.uppercase()
    }
    if (this.item.type === 'NUMBER') {
      this.numericTypes()
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
    this.props.autofocus = this.item.autofocus
    this.props.size = this.item.size
    this.props.icon = this.item.icon
  }

  // 合并methods
  mergeMethods() {
    const isDetailPage = this.item.detailType
    if (!isDetailPage) {
      new InputMethod(this.item, this.instance)
    }

    this.overrideKeyDown()
  }

  numericTypes() {
    // 数字类型输入控制
    // 只能输入 正整数
    let string = ''
    const length = this.item.length || 100
    if (this.item.webconf && this.item.webconf.ispositive) {
      string = `^\\d{0,${length}}(\\\.[0-9]{0,${this.item.scale}})?$`
    } else {
      string = `^(-|\\+)?\\d{0,${length -
        this.item.scale}}(\\\.[0-9]{${this.item.scale - 1},${
        this.item.scale
      }})?$`
    }

    const typeRegExp = new RegExp(string)

    if (this.item.scale >= 0) {
      this.item.props.regx = typeRegExp
      this.props.regx = typeRegExp
    } else if (this.item.webconf && this.item.webconf.ispositive) {
      this.item.props.regx = typeRegExp
      this.props.regx = typeRegExp
    }
  }

  // 重写按下键盘事件
  overrideKeyDown() {
    const keyDownFn = this.instance.methods.handleKeydown
    const isDetailPage = this.item.detailType
    this.instance.methods.handleKeydown = function(e) {
      // 禁止输入单引号 '
      if (e.key==='\'') {
        e.stopPropagation()
        e.preventDefault()
      }

      // 明细界面的input，按下回车后，光标自动移到下一个Input框里
      if (isDetailPage && e.keyCode === 13) {
        const currentWrapDom = this.$parent.$parent.$el.parentNode // 当前组件的容器节点
        this.nextInputFocus(currentWrapDom)
      }
      keyDownFn.call(this, ...arguments)
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
