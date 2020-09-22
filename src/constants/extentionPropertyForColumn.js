export default [
  {
    name: '是否加密',
    key: 'ispassword',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '加密后字段值即显示***',
    supportType: ['byPage']
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
        name: '关联字段在表头',
        key: 'maintable',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
      }      
    ],
    description: 'B字段根据A字段选择的值过滤出对应条件下的数据',
    supportType: ['object']
  },
  {
    name: 'HR折叠',
    key: 'hrdisplay',
    type: 'radio',
    enumerateValue: [{ text: '展开', value: 'expand' }, { text: '折叠', value: 'fold' }],
    description: '根据配置决定hr字段默认是展开还是合拢，没配置则默认为【展开】',
    supportType: ['trigger']
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
    description: '控制日期型字段可选范围',
    supportType: ['byPage']
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
    }, {
      name: '关联表id',
      key: 'reftableid',
      type: 'input'
    }, {
      name: '路由ID（系统内不可重复）',
      key: 'linkname',
      type: 'input'
    }],
    description: '列表界面指定字段显示链接，点击可进入对应界面。（支持tabpanle、object、popwin、customized、link）',
    supportType: ['byPage', 'sheetNo', 'select', 'object']
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
    description: '赋值方式为计算列，通过其他字段及计算公式所得',
    supportType: ['computed']
  },
  {
    name: '外键、虚拟字段列表翻译',
    key: 'refhsfval',
    type: 'input',
    description: '填写转换显示格式的path',
    supportType: ['object', 'trigger']
  },
  {
    name: '外键、虚拟字段单对象翻译',
    key: 'refhsfobjval',
    type: 'input',
    description: '填写转换显示格式的path',
    supportType: ['object', 'trigger']
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
    }, {
      name: '运算符',
      key: 'expression',
      type: 'input'
    }, {
      name: '匹配值',
      key: 'match',
      type: 'radio',
      enumerateValue: [
        { text: '显示值', value: 'label' },
        { text: '值', value: 'value' }]
    }, {
      name: '是否走隐藏逻辑',
      key: 'ishide',
      type: 'radio',
      enumerateValue: [
        { text: '是', value: true },
        { text: '否', value: false }]
    }
    ],
    description: '根据A字段的值决定B字段是否显示(若A字段为外键类型需根据显示值匹配，则match配置为label，不配置默认为value)',
    supportType: ['sheetNo', 'byPage', 'select', 'object', 'computed', 'trigger']
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
    description: '随着A字段、B字段输入的值，即时变化显示C字段的值，C为联动字段',
    supportType: ['byPage']
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
    description: '区间字段为虚拟字段，仅支持单对象',
    supportType: ['trigger']
  },
  {
    name: '是否过滤不可用数据',
    key: 'must_be_active',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '只针对关联表中ISACTIVE字段可编辑，或不可编辑但该表有作废这两种情况',
    supportType: ['object']
  },
  {
    name: '前端自定义参数',
    key: 'webconf',
    type: 'input',
    outputValueType: 'JSON',
    description: '自定义参数格式及内容',
    supportType: ['sheetNo', 'byPage', 'select', 'object', 'computed', 'trigger']
  },
  {
    name: '字段翻译内容是否缓存',
    key: 'needcache',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '不配置默认为true，配置为false则不进行缓存',
    supportType: ['object', 'computed', 'trigger']
  },
  {
    name: '字段缓存时间配置',
    key: 'refremotecachetimeout',
    type: 'input',
    inputType: 'Number',
    description: '字段缓存时间设置，单位为秒',
    supportType: ['object', 'computed', 'trigger']
  },
  {
    name: '列表查询条件区域字段下拉列表数据权限配置',
    key: 'precollist',
    type: 'object-group',
    showLabel: false,
    objectInfo: [
      {
        name: '数据权限标识',
        key: 'premtype',
        type: 'input'
      },
      {
        name: '来源表中的字段',
        key: 'refcol',
        type: 'input'
      },
      {
        name: '是否获取编辑权限',
        key: 'iswrite',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }]
      }
    ],
    description: '列表界面查询条件区域外键字段下拉列表的数据权限',
    supportType: ['object']
  },
  {
    name: '单对象界面字段下拉列表数据权限配置',
    key: 'precolobj',
    type: 'object-group',
    showLabel: false,
    objectInfo: [
      {
        name: '数据权限标识',
        key: 'premtype',
        type: 'input'
      },
      {
        name: '本表对应字段',
        key: 'refcol',
        type: 'input'
      },
      {
        name: '是否获取编辑权限',
        key: 'iswrite',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }]
      }
    ],
    description: '单对象界面外键字段下拉列表的数据权限',
    supportType: ['object']
  },
  {
    name: '单对象关联(店仓)下拉列表数据权限配置',
    key: 'refcolprem',
    type: 'object-group',
    showLabel: false,
    objectInfo: [
      {
        name: '数据权限标识',
        key: 'premtype',
        type: 'input'
      },
      {
        name: '该业务表上主权限(店仓)字段',
        key: 'srccol',
        type: 'input'
      },
      {
        name: '来源表中的字段',
        key: 'refcol',
        type: 'input'
      },
      {
        name: '是否获取编辑权限',
        key: 'iswrite',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }]
      }
    ],
    description: '控制单对象界面关联(店仓)外键字段下拉列表的数据权限',
    supportType: ['object']
  },
  {
    name: '列表查询规则',
    key: 'queryrule',
    type: 'input-group',
    inputLists: [
      {
        name: '匹配规则',
        key: 'matchrule',
        type: 'select',
        selectOptions: [
          { text: '-- 请选择 --', value: '' },
          { text: '全匹配', value: '0' },
          { text: '左匹配', value: '1' },
          { text: '右匹配', value: '2' },
          { text: '全模糊', value: '3' },
        ]
      },
      {
        name: '查询时是否必填',
        key: 'required',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
      }      
    ],
    description: '列表查询规则'
  },
];
