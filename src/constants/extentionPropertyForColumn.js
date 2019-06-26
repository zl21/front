export default [
  {
    name: '是否加密',
    key: 'ispassword',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '加密后字段值即显示***'
  },
  {
    name: '字段值过滤',
    key: 'refcolval',
    type: 'input-group',
    inputLists: [
      {
        name: '外键关联字段',
        key: 'fixcolumn',
        type: 'input'
      },
      {
        name: '已知条件字段',
        key: 'srccol',
        type: 'input'
      },
      {
        name: '过滤字段在表头',
        key: 'maintable',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
      },
    ],
    description: 'B字段根据A字段选择的值过滤出对应条件下的数据'
  },
  {
    name: 'HR折叠',
    key: 'hrdisplay',
    type: 'radio',
    enumerateValue: [{ text: '展开', value: 'expand' }, { text: '折叠', value: 'fold' }],
    description: '根据配置决定hr字段默认是展开还是合拢，没配置则默认为【展开】'
  },
  {
    name: '日期类型',
    key: 'datelimit',
    type: 'radio',
    enumerateValue: [
      { text: '所有', value: 'all' },
      { text: '之前（含今天）', value: 'before' },
      { text: '之后（含今天）', value: 'after' },
      { text: '之前（不含今天）', value: 'beforetoday' },
      { text: '之后（不含今天）', value: 'aftertoday' }
    ],
    description: '控制日期型字段可选范围'
  },
  {
    name: '字段链接定制界面',
    key: 'customerurl',
    type: 'input-group',
    inputLists: [{
      name: '定制化界面地址',
      key: 'tableurl',
      type: 'input'
    }, {
      name: '弹出类型',
      key: 'objdistype',
      type: 'input'
    }, {
      name: '关联字段名称',
      key: 'refobjid',
      type: 'input'
    }, {
      name: '窗口名称',
      key: 'reftabdesc',
      type: 'input'
    }, {
      name: '关联表',
      key: 'reftablename',
      type: 'input'
    }],
    description: '列表界面指定字段显示链接，点击可进入对应界面'
  },
  {
    name: '虚拟字段-计算列',
    key: 'computedcol',
    type: 'input-group',
    inputLists: [{
      name: '计算表达式',
      key: 'express',
      type: 'input'
    }, {
      name: '字段列表',
      key: 'cols',
      type: 'input',
      outputValueType: 'Array'
    }, {
      name: '日期格式',
      key: 'dformat',
      type: 'input'
    }],
    description: '赋值方式为计算列，通过其他字段及计算公式所得'
  },
  {
    name: '外键、虚拟字段列表翻译',
    key: 'refhsfval',
    type: 'input',
    description: '填写转换显示格式的path'
  },
  {
    name: '外键、虚拟字段单对象翻译',
    key: 'refhsfobjval',
    type: 'input',
    description: '填写转换显示格式的path'
  },
  {
    name: '字段隐藏显示',
    key: 'hidecolumn',
    type: 'input-group',
    inputLists: [{
      name: '影响列',
      key: 'refcolumn',
      type: 'input'
    }, {
      name: '影响值',
      key: 'refval',
      type: 'input'
    }],
    description: '根据A字段的值决定B字段是否显示'
  },
  {
    name: '界面联动计算',
    key: 'dynamicforcompute',
    type: 'input-group',
    inputLists: [{
      name: '计算表达式',
      key: 'express',
      type: 'input'
    }, {
      name: '相关字段',
      key: 'refcolumns',
      type: 'input',
      outputValueType: 'Array'
    }, {
      name: '联动字段',
      type: 'input',
      key: 'computecolumn'
    }],
    description: '随着A字段、B字段输入的值，即时变化显示C字段的值，C为联动字段'
  },
  {
    name: '状态合并查询',
    key: 'integrationstatus',
    type: 'input-group',
    inputLists: [{
      name: '合并后的查询字段名称',
      type: 'input',
      key: 'name'
    }, {
      name: '合并字段',
      key: 'status',
      type: 'input',
      outputValueType: 'Array'
    }],
    description: '在列表界面将多个下拉选项状态字段的值合并到一个查询字段中显示'
  },
  {
    name: '区间配置',
    key: 'rangecolumn',
    type: 'input-group',
    inputLists: [{
      name: '上行限制字段',
      type: 'input',
      key: 'upperlimit'
    }, {
      name: '下行限制字段',
      type: 'input',
      key: 'lowerlimit'
    }],
    description: '区间字段为虚拟字段，仅支持单对象'
  },
  {
    name: '是否过滤不可用数据',
    key: 'must_be_active',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '只针对关联表中ISACTIVE字段可编辑，或不可编辑但该表有作废这两种情况'
  },
  {
    name: '前端自定义参数',
    key: 'webconf',
    type: 'input',
    outputValueType: 'JSON',
    description: '自定义参数格式及内容'
  }
];
