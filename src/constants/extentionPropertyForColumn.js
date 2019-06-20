export default [
  {
    name: '是否加密',
    key: 'ispassword',
    type: 'radio',
    enumerateValue: [true, false],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '过滤',
    key: 'refcolval',
    type: 'filter',
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: 'HR折叠',
    key: 'hrdisplay',
    type: 'radio',
    enumerateValue: ['fold', 'expand'],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '日期类型',
    key: 'datelimit',
    type: 'radio',
    enumerateValue: ['all', 'before', 'after', 'beforetoday', 'aftertoday'],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '外键',
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
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '虚拟字段',
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
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '影响显示',
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
    description: '请描述一下这个配置有啥作用'
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
      name: '相关列',
      key: 'refcolumns',
      type: 'input',
      outputValueType: 'Array'
    }, {
      name: '受影响列',
      type: 'input',
      key: 'computecolumn'
    }],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '状态合并查询',
    key: 'integrationstatus',
    type: 'input-group',
    inputLists: [{
      name: '合并后的查询字段名',
      type: 'input',
      key: 'name'
    }, {
      name: '合并字段',
      key: 'status',
      type: 'input',
      outputValueType: 'Array'
    }],
    description: '请描述一下这个配置有啥作用'
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
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '是否过滤不可用数据',
    key: 'must_be_active',
    type: 'radio',
    enumerateValue: [true, false],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '前端自定义参数',
    key: 'webconf',
    type: 'input-group',
  }
];
