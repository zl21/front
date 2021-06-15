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
    clearable: true,
    // 设置输入框为禁用状态
    disabled: false,
    // 设置输入框为只读
    readonly: false,
    // 文本域默认行数，仅在 textarea 类型下有效
    row: 4,
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
  }
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
    // 全选
    chooseAll: true,
    // 是否支持多选
    multiple: true,
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
    optionsVisible: true
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
    trueValue: [String, Number, Boolean],
    falseValue: [String, Number, Boolean],
    // 支持checkout样式为radio样式
    circle: false
  },
  event: {
    change: (event, $this) => {}
  }
};
// 日期选择
const DatePicker = {
  type: 'DatePicker', // 必填!
  field: '', // 必填!
  title: '活动日期', // 必填!
  // input值, type为daterange,datetimerange value为数组 [start_value,end_value]
  value: ['2018-02-20', new Date()],
  props: {
    // 显示类型，可选值为 date、daterange、datetime、datetimerange、year、month
    type: 'date', // 必填!
    // 展示的日期格式
    format: '',
    // 日期选择器出现的位置，可选值为toptop-starttop-endbottombottom-startbottom-endleftleft-startleft-endrightright-startright-end
    placement: 'bottom-start',
    // 占位文本
    placeholder: '请选择',
    // 选择器额外配置，比如不可选日期与快捷选项
    options: {},
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

// 时间点选择
const TimePicker = {
  type: 'TimePicker', // 必填!
  field: 'section_time', // 必填!
  title: '活动时间', // 必填!
  // input值, type为timerange value为数组 [start_value,end_value]
  value: [],
  props: {
    // 显示类型，可选值为 time、timerange
    type: 'timerange', // 必填!
    // 展示的时间格式
    format: 'HH:mm:ss',
    // 下拉列表的时间间隔，数组的三项分别对应小时、分钟、秒。例如设置为 [1, 15] 时，分钟会显示：00、15、30、45。
    steps: [],
    // 时间选择器出现的位置，可选值为toptop-starttop-endbottombottom-startbottom-endleftleft-startleft-endrightright-startright-end
    placement: 'bottom-start',
    // 占位文本
    placeholder: '请选择',
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
    hidecolumns: ['id', 'value'],
    isShowPopTip: () => true, // form 不展示
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
    // 是否开启回车默认选中第一条
    enterType: false,
    placeholder: '请选择'
  }
};
// 下拉框
const DropMultiSelectFilter = {
  type: 'DropMultiSelectFilter', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    // 是否是单选，可选值为 true、false
    single: true,
    hidecolumns: ['id', 'value'],
    isShowPopTip: () => true, // form 不展示
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
    // 是否开启回车默认选中第一条
    enterType: false,
    placeholder: '请选择',
  }
};

// 弹框多选
const AttachFilter = {
  type: 'AttachFilter', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    // 是否显示气泡提示框 true、false
    optionTip: true,
    // 是否显示输入完成后是否禁用 true、false
    show: true,
    // 是否显示筛选提示弹窗 true、false
    filterTip: true,
    // 是否选中后禁止编辑 true、false
    placeholder: '请选择',
    // 模糊查询的文字信息，支持多列              item.props.AutoData = [];
    AutoData: [],
    // 定义选中展示的文字的key
    hideColumnsKey: ['id'],
    //
    disabled: false,
    // 是否开启回车默认选中第一条
    enterType: false,
    filterDate: {},
    // 配置弹窗的配置项 model
    dialog: {
      model: {
        title: '弹窗多选',
        mask: true,
        draggable: true,
        closable: true,
        scrollable: true,
        maskClosable: false,
        width: 920
      }
    },
    datalist: [
      {
        value: '更多筛选',
        lable: 0
      },
      {
        value: '导入',
        lable: 2
      }
    ]
  }
};
// 弹框多选
const ImageUpload = {
  type: 'ImageUpload', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    itemdata: {
      url: '', // 上传地址
      sendData: {}, // 上传参数
      width: 200,
      height: 200,
      colname: 'IMAGE',
      readonly: false,
      valuedata: [],
    },
    placeholder: '请选择',
  }
};

// 文本编辑器
const Wangeditor = {
  type: 'Wangeditor', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    height: 200,
    placeholder: '请选择',
  }
};
// 读写规则
const EnumerableInput = {
  type: 'EnumerableInput', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    height: 200,
    placeholder: '请选择',
  }
};

// 扩展属性
const ExtentionInput = {
  type: 'ExtentionInput', // 必填!
  field: '', // 必填!
  title: '', // 必填!
  value: '',
  props: {
    height: 200,
    placeholder: '请选择',
  }
};

const dataProp = {
  DropDownSelectFilter,
  TimePicker,
  DatePicker,
  checkbox,
  radiobox,
  // checkboxGroup,
  select,
  input,
  AttachFilter,
  ImageUpload,
  Wangeditor,
  EnumerableInput,
  ExtentionInput,
  DropMultiSelectFilter

};
export default dataProp;
