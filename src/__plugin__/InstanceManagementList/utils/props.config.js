// 输入框
const input = {
  // item 类型
  type: 'input', // 必填!
  // label名称
  title: '', // 必填!
  // 字段名称
  field: '', // 必填!
  // input值
  value: '',
  props: {
    // 输入框类型，可选值为 text、password、textarea、url、email、date
    type: 'text', // 必填!
    // 是否显示清空按钮
    clearable: false,
    // 设置输入框为禁用状态
    disabled: false,
    // 设置输入框为只读
    readonly: false,
    // 文本域默认行数，仅在 textarea 类型下有效
    rows: 4,
    // 自适应内容高度，仅在 textarea 类型下有效，可传入对象，如 { minRows: 2, maxRows: 6 }
    autosize: false,
    // 将用户的输入转换为 Number 类型。在有正则的时候：1）该输入框为空的时候，值为空字符串。2）input方法不可用。
    number: false,
    // 自动获取焦点
    autofocus: false,
    // 原生的自动完成功能，可选值为 off 和 on
    autocomplete: 'off',
    // 占位文本
    placeholder: '请输入',
    // 输入框尺寸，可选值为large、small、default或者不设置
    size: 'default',
    // 最大输入长度
    maxlength: null,
    // 输入框尾部图标，仅在 text 类型下有效
    icon: null,
    // 输入框头部图标
    prefix: null,
    // 输入框尾部图标
    suffix: null,
    // 给表单元素设置 id，详见 Form 用法。
    'element-id': null,
    // 原生的 spellcheck 属性
    spellcheck: false,
    // 原生的 wrap 属性，可选值为 hard 和 soft，仅在 textarea 下生效
    wrap: 'soft',
    // 正则表达式
    regx: null
  },
  event: {
    // 按下回车键时触发
    enter: (event, $this) => {},
    // 设置 icon 属性后，点击图标时触发
    click: (event, $this) => {},
    // 数据改变时触发
    change: (event, $this) => {},
    // 输入框聚焦时触发
    focus: (event, $this) => {},
    // 输入框失去焦点时触发
    blur: (event, $this) => {},
    // 原生的 keyup 事件
    keyup: (event, $this) => {},
    // 原生的 keydown 事件
    keydown: (event, $this) => {},
    // 原生的 keypress 事件
    keypress: (event, $this) => {},
    // 开启 search 时可用，点击搜索或按下回车键时触发
    search: (event, $this) => {},
    // 添加正则后，校验出错的时候触发
    regxCheck: (value, $this, errorValue) => {}
  },
};
// 下拉框
const select = {
  type: 'select', // 必填!
  // label名称
  title: '', // 必填!
  // 字段名称
  field: '', // 必填!
  // input值
  value: '',
  // 可选参数
  options: [
    // { value: '104', label: '生态蔬菜', disabled: false },
    // { value: '105', label: '新鲜水果', disabled: false },
  ],
  props: {
    // 是否支持多选
    multiple: false,
    // 多选情况下的样式控制,只在multiple为true有效
    multipleType: false,
    // 是否禁用
    disabled: false,
    // 是否可以清空选项，只在单选时有效
    clearable: true,
    // 选择框大小，可选值为large、small、default或者不填
    size: 'default',
    // 选择框默认文字
    placeholder: '请选择',
    // 当下拉列表为空时显示的内容
    'not-found-text': '无匹配数据',
    // 在返回选项时，是否将 label 和 value 一并返回，默认只返回 value
    'label-in-value': false,
    // 弹窗的展开方向，可选值为 bottom 和 top
    placement: 'bottom',
    // 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
    transfer: true,
  }
};
// 复选框组件
// const checkboxGroup = {
//   type: 'checkboxGroup', // 必填!
//   // label名称
//   title: '', // 必填!
//   // 字段名称
//   field: '', // 必填!
//   // input值
//   value: false,
//   // 可选参数
//   options: [], // 必填!
//   props: {
//     // 多选框组的尺寸，可选值为 large、small、default 或者不设置
//     size: 'default',
//     // 是否禁用当前项
//     disabled: false
//   }
// };
// 单选框
const radiobox = {
  type: 'radiobox', // 必填!
  // label名称
  title: '', // 必填!
  // 字段名称
  field: '', // 必填!
  // input值
  value: false,
  // 可选参数
  props: {
    // 多选框组的尺寸，可选值为 large、small、default 或者不设置
    size: 'default',
    // 是否禁用当前项
    disabled: false
  }
};
// 复选框
const checkbox = {
  type: 'checkbox', // 必填!
  // label名称
  title: '', // 必填!
  // 字段名称
  field: '', // 必填!
  // input值
  value: false,
  // 可选参数
  props: {
    // 多选框组的尺寸，可选值为 large、small、default 或者不设置
    size: 'default',
    // 是否禁用当前项
    disabled: false,
    // 支持checkout样式为radio样式
    circle: false
  },
  event: {
    change: (event, $this) => {},
  }
};
// 日期选择
const DatePicker = {
  type: 'DatePicker', // 必填!
  field: '', // 必填!
  title: '活动日期', // 必填!
  // input值, type为daterange,datetimerange value为数组 [start_value,end_value]
  value: '',
  props: {
    // 显示类型，可选值为 date、daterange、datetime、datetimerange、year、month
    type: 'datetimerange', // 必填!
    // 展示的日期格式
    format: 'yyyy-MM-dd HH:mm:ss',
    // 日期选择器出现的位置，可选值为toptop-starttop-endbottombottom-startbottom-endleftleft-startleft-endrightright-startright-end
    placement: 'bottom-start',
    // 占位文本
    placeholder: '请选择获得时间',
    // 选择器额外配置，比如不可选日期与快捷选项
    options: {
      disabledDate(date) {
        return date && date.valueOf() > Date.now();
      }
    },
    // 手动控制日期选择器的显示状态，true 为显示，false 为收起。使用该属性后，选择器不会主动关闭。建议配合 slot 及 confirm 和相关事件一起使用
    open: null,
    // 是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭
    confirm: false,
    // 尺寸，可选值为large、small、default或者不设置
    size: 'default',
    // 是否禁用选择器
    disabled: false,
    // 是否显示清除按钮
    clearable: true,
    // 完全只读，开启后不会弹出选择器
    readonly: false,
    // 文本框是否可以输入
    editable: false,
    // 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
    transfer: true
  }
};

// 下拉框
const DropDownSelectFilter = {
  type: 'DropDownSelectFilter', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    // 是否是单选，可选值为 true、false
    single: true,
    // 下拉气泡表格里数据
    data: {},
    // 数据总条数
    totalRowCount: 0,
    // 每页条数
    pageSize: 10,
    // 模糊搜索的数据
    AutoData: [],
    // 模糊搜索要显示的列
    columns: [],
    // 无数据的时候提示
    dataEmptyMessage: '暂无数据',
    // 下拉多选 默认选中数据
    defaultSelected: [],
    // 是否将弹层放置于 body 内
    transfer: true,
    columnsKey: []
  }
};


const dataProp = {
  DatePicker,
  checkbox,
  radiobox,
  // checkboxGroup,
  select,
  input,
  DropDownSelectFilter
};
export default dataProp;
