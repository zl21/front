<template>
  <div class="r3-input-with-select">
    <component
      v-if="componentName"
      :is="componentName"
      v-bind="$attrs"
      v-on="$listeners"
      :disabled="disabled"
      :placeholder="placeholder"
      v-model="inputValue"
      @on-change="handleInput"
    >
      <Select
        v-model="selectValue"
        slot="prepend"
        style="width: 80px"
        transfer
        @on-change="handleSelect"
      >
        <Option value="all">全部</Option>
        <Option value="equal">等于</Option>
        <Option value="isNull">为空</Option>
        <Option value="isNotNull">非空</Option>
      </Select>
    </component>
  </div>
</template>

<script type="text/ecmascript-6">
import CustomInput from '../inheritanceComponents/Input'
import '../../assets/styles/components/InputWithSelect.less'
import { enableKAQueryDataForUser } from '../../constants/global'
import { R3_BUTTON_CLICK, R3_LIST_SEARCH } from '../../__utils__/dispatchEvent'
import { getSelectOption, get_default_InputWithSelect } from '../FormComponents/parameterDataProcessing'

export default {
  name: 'r3-input-with-select',

  data() {
    return {
      inputValue: '',
      componentName: '',
      selectValue: '',
      disabled: false,
      placeholder: ''
    }
  },

  props: {
    value: {
      type: [String, Array],
    }
  },

  model: {
    event: 'change',
    props: 'value'
  },

  methods: {
    handleSelect(val) {
      switch (val) {
        case 'all':
        case 'equal':
          this.disabled = false
          this.$emit('change', get_default_InputWithSelect(this.inputValue, this.selectValue))
          break
        case 'isNotNull':
        case 'isNull':
          this.inputValue = ''
          this.$emit('change', get_default_InputWithSelect(this.inputValue, this.selectValue))
          this.disabled = true
          break
      }
    },

    handleInput(e) {
      const value = get_default_InputWithSelect(e.target.value, this.selectValue)
      this.$emit('change', value)
    },

    // 获取输入框值
    // 要考虑接口设置的默认值，与下拉选项可能不匹配。例如接口配了默认1，扩展属性配了'为空'条件
    getInitValue(value) {
      let val = value
      if (Array.isArray(val)) {
        val = val.join(',')
      }

      if (['isNotNull', 'isNull'].includes(this.selectValue)) {
        return ''
      } else if (['all', 'equal'].includes(this.selectValue) && ['is null', 'is not null'].includes(val)) {
        // 例如没有开启enableKAQueryDataForUser时,选了为空，关闭界面再打开，由于选项可能变成全部或等于。这时输入框显示的值就不对了
        return ''
      } else if (val.includes('=')) {
        return val.replace(/=/g, '')
      } else {
        return val
      }
    },

    // 重置时，缓存select
    handleClick(e) {
      if(e.detail.type === 'reset') {
        const userId = this.getUserId()
        localStorage.setItem(`${userId}_${this._tableName}_${this._colname}`, this.$attrs.webconf.inputWithSelectOption)
      }
    },

    // 查询成功时，缓存select
    handleSearch() {
      if (enableKAQueryDataForUser() || this.$attrs.item.enableKAQueryDataForUser) {
        const userId = this.getUserId()
        localStorage.setItem(`${userId}_${this._tableName}_${this._colname}`, this.selectValue)
      }
    },

    // 获取用户id
    getUserId() {
      const userJson = localStorage.getItem('userInfo') || ''
      let user = {}
      if (userJson) {
        user = JSON.parse(userJson)
      }
      return user.id
    },

    // 绑定点击事件
    attachClickEvent() {
      window.addEventListener(R3_BUTTON_CLICK, this.handleClick)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener(R3_BUTTON_CLICK, this.handleClick)
      })
    },

    // 绑定查询事件
    attachSearchEvent() {
      window.addEventListener(R3_LIST_SEARCH, this.handleSearch)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener(R3_LIST_SEARCH, this.handleSearch)
      })
    }
  },

  async created() {
    // 开启enableKAQueryDataForUser时。需要从缓存中获取下拉选项的选中值
    this.selectValue = this.$attrs.webconf.inputWithSelectOption
    if (enableKAQueryDataForUser() || this.$attrs.item.enableKAQueryDataForUser) {
      this._tableName = this.$route.params.tableName
      this._colname = this.$attrs.item.colname
      const option = getSelectOption(this._colname, this._tableName)
      if (option) {
        this.selectValue = option
      }
    }
    if (['isNotNull', 'isNull'].includes(this.selectValue)) {
      this.disabled = true
    }
    this.inputValue = this.getInitValue(this.$attrs.item.default || '')
    this.placeholder= this.$attrs.webconf && this.$attrs.webconf.placeholder
    this.componentName = new CustomInput({
      ...this.$attrs.item,
      webconf: this.$attrs.webconf
    }).init().Components || ''

    this.attachClickEvent()
    this.attachSearchEvent()
  }
}
</script>

<style lang="less" scoped>
</style>