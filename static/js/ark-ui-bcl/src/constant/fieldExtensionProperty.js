export default [
  {
    name: '是否加密',
    key: 'ispassword',
    type: 'custom',
    component: 'PassWord',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '加密后字段值即显示***',
    // supportType: ['byPage']
  },
  {
    name: '字段值过滤',
    key: 'refcolval',
    type: 'input-group',
    inputLists: [
      {
        name: '外键关联字段',
        key: 'fixcolumn',
        type: 'input',
      },
      {
        name: '已知条件字段',
        key: 'srccol',
        type: 'input',
      },
      {
        name: '关联字段在表头',
        key: 'maintable',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
    ],
    description: 'B字段根据A字段选择的值过滤出对应条件下的数据',
    supportType: ['object'],
  },
  {
    name: 'HR折叠',
    key: 'hrdisplay',
    type: 'radio',
    enumerateValue: [
      { text: '展开', value: 'expand' },
      { text: '折叠', value: 'fold' },
    ],
    description: '根据配置决定hr字段默认是展开还是合拢，没配置则默认为【展开】',
    supportType: ['trigger'],
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
      { text: '之后（不含今天）', value: 'aftertoday' },
    ],
    description: '控制日期型字段可选范围',
    supportType: ['byPage'],
  },
  {
    name: '字段链接定制界面',
    key: 'customerurl',
    type: 'input-group',
    inputLists: [
      {
        name: '定制化界面地址',
        key: 'tableurl',
        type: 'input',
      },
      {
        name: '弹出类型',
        key: 'objdistype',
        type: 'input',
      },
      {
        name: '关联字段名称',
        key: 'refobjid',
        type: 'input',
      },
      {
        name: '窗口名称',
        key: 'reftabdesc',
        type: 'input',
      },
      {
        name: '关联表',
        key: 'reftablename',
        type: 'input',
      },
      {
        name: '关联表id',
        key: 'reftableid',
        type: 'input',
      },
      {
        name: '路由ID（系统内不可重复）',
        key: 'linkname',
        type: 'input',
      },
      {
        name: '自定义组件（objdistype值为defined时生效）',
        key: 'cellcomponent',
        type: 'input',
      },
    ],
    description:
      '列表界面指定字段显示链接，点击可进入对应界面。（支持tabpanle、object、popwin、customized、link）',
    supportType: ['byPage', 'sheetNo', 'select', 'object'],
  },
  {
    name: '虚拟字段-计算列',
    key: 'computedcol',
    type: 'input-group',
    inputLists: [
      {
        name: '计算表达式',
        key: 'express',
        type: 'input',
      },
      {
        name: '字段列表',
        key: 'cols',
        type: 'input',
        outputValueType: 'Array',
      },
      {
        name: '日期格式',
        key: 'dformat',
        type: 'input',
      },
    ],
    description: '赋值方式为计算列，通过其他字段及计算公式所得',
    supportType: ['computed'],
  },
  {
    name: '外键、虚拟字段列表翻译',
    key: 'refhsfval',
    type: 'input',
    description: '填写转换显示格式的path',
    supportType: ['object', 'trigger'],
  },
  {
    name: '外键、虚拟字段单对象翻译',
    key: 'refhsfobjval',
    type: 'input',
    description: '填写转换显示格式的path',
    supportType: ['object', 'trigger'],
  },
  {
    name: '字段隐藏显示',
    key: 'hidecolumn',
    type: 'input-group',
    inputLists: [
      {
        name: '影响列',
        key: 'refcolumn',
        type: 'input',
      },
      {
        name: '影响值',
        key: 'refval',
        type: 'input',
      },
      {
        name: '运算符',
        key: 'expression',
        type: 'input',
      },
      {
        name: '匹配值',
        key: 'match',
        type: 'radio',
        enumerateValue: [
          { text: '显示值', value: 'label' },
          { text: '值', value: 'value' },
        ],
      },
      {
        name: '是否走隐藏逻辑',
        key: 'ishide',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
      {
        name: '隐藏字段时保留字段的位置',
        key: 'occupied',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
    ],
    description:
      '根据A字段的值决定B字段是否显示(若A字段为外键类型需根据显示值匹配，则match配置为label，不配置默认为value)',
    supportType: [
      'sheetNo',
      'byPage',
      'select',
      'object',
      'computed',
      'trigger',
    ],
  },
  {
    name: '界面联动计算',
    key: 'dynamicforcompute',
    type: 'input-group',
    inputLists: [
      {
        name: '计算表达式',
        key: 'express',
        type: 'input',
      },
      {
        name: '相关字段',
        key: 'refcolumns',
        type: 'input',
        outputValueType: 'Array',
      },
      {
        name: '联动字段',
        type: 'input',
        key: 'computecolumn',
      },
    ],
    description: '随着A字段、B字段输入的值，即时变化显示C字段的值，C为联动字段',
    supportType: ['byPage'],
  },
  {
    name: '区间配置',
    key: 'rangecolumn',
    type: 'input-group',
    inputLists: [
      {
        name: '上行限制字段',
        type: 'input',
        key: 'upperlimit',
      },
      {
        name: '下行限制字段',
        type: 'input',
        key: 'lowerlimit',
      },
    ],
    description: '区间字段为虚拟字段，仅支持单对象',
    supportType: ['trigger'],
  },
  {
    name: '是否过滤不可用数据',
    key: 'must_be_active',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description:
      '只针对关联表中ISACTIVE字段可编辑，或不可编辑但该表有作废这两种情况',
    supportType: ['object'],
  },
  // {
  //   name: '前端自定义参数',
  //   key: 'webconf',
  //   type: 'input',
  //   outputValueType: 'JSON',
  //   description: '自定义参数格式及内容',
  //   supportType: [
  //     'sheetNo',
  //     'byPage',
  //     'select',
  //     'object',
  //     'computed',
  //     'trigger',
  //   ],
  // },
  {
    name: '字段翻译内容是否缓存',
    key: 'needcache',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description: '不配置默认为true，配置为false则不进行缓存',
    supportType: ['object', 'computed', 'trigger'],
  },
  {
    name: '字段缓存时间配置',
    key: 'refremotecachetimeout',
    type: 'input',
    inputType: 'Number',
    description: '字段缓存时间设置，单位为秒',
    supportType: ['object', 'computed', 'trigger'],
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
        type: 'input',
      },
      {
        name: '来源表中的字段',
        key: 'refcol',
        type: 'input',
      },
      {
        name: '是否获取编辑权限',
        key: 'iswrite',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
    ],
    description: '列表界面查询条件区域外键字段下拉列表的数据权限',
    supportType: ['object'],
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
        type: 'input',
      },
      {
        name: '本表对应字段',
        key: 'refcol',
        type: 'input',
      },
      {
        name: '是否获取编辑权限',
        key: 'iswrite',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
    ],
    description: '单对象界面外键字段下拉列表的数据权限',
    supportType: ['object'],
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
        type: 'input',
      },
      {
        name: '该业务表上主权限(店仓)字段',
        key: 'srccol',
        type: 'input',
      },
      {
        name: '来源表中的字段',
        key: 'refcol',
        type: 'input',
      },
      {
        name: '是否获取编辑权限',
        key: 'iswrite',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
    ],
    description: '控制单对象界面关联(店仓)外键字段下拉列表的数据权限',
    supportType: ['object'],
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
        ],
      },
      {
        name: '查询时是否必填',
        key: 'required',
        type: 'radio',
        enumerateValue: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
      },
    ],
    description: '列表查询规则',
  },
  {
    name: '是否开启唯一校验',
    key: 'preverifyenabled',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description:
      '当表单新增时，填入值在文本框失去焦点时，校验是否表内已存在 / 文本框失去焦点校验唯一性',
    supportType: ['byPage'],
  },
  // 暂时关闭。因为前端展示没实现
  // {
  //   name: '隐藏子表',
  //   key: 'table_for_key',
  //   type: 'custom',
  //   component: 'TableQuery',
  //   description: '当字段等于某个值时，隐藏子表',
  // },
  {
    name: 'isdefault字段',
    key: 'ignoreDisableWhenEdit',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description: 'isdefault字段可配置项',
  },
  {
    name: '隐藏时清空字段值',
    key: 'clearWhenHidden',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description: '配置了hidecolumn扩展属性的字段，隐藏时自动清空字段内容。',
    supportType: [
      'sheetNo',
      'byPage',
      'select',
      'object',
      'computed',
      'trigger',
    ],
  },
  {
    name: '配置链接进行跳转',
    key: 'Outside',
    type: 'keyValue',
    description:
      '在字段的备注中，可点击链接进行跳转，例如https://www.baidu.com/。注意：字段配置中需要勾选【显示备注】',
    components: [
      {
        name: '配置链接进行跳转',
        key: 'Outside',
        type: 'input',
        placeholder: '请输入链接地址',
      },
    ],
  },
  {
    name: '控制数值型字段不能输入负号',
    key: 'ispositive',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description: '控制数值型字段不能输入负号。',
    supportType: ['byPage'],
  },
  {
    name: '图片上传数量',
    key: 'ImageSize',
    type: 'keyValue',
    description: '控制图片上传数量',
    components: [
      {
        name: '图片上传数量',
        key: 'ImageSize',
        type: 'input',
        inputType: 'NUMBER',
        placeholder: '请输入数字',
      },
    ],
    supportType: ['byPage'],
  },
  {
    name: '文件上传数量',
    key: 'filesLength',
    type: 'keyValue',
    description: '控制文件上传数量',
    components: [
      {
        name: '文件上传数量',
        key: 'filesLength',
        type: 'input',
        inputType: 'NUMBER',
        placeholder: '请输入数字',
      },
    ],
    supportType: ['byPage'],
  },
  {
    name: '单个文件上传大小',
    key: 'filesize',
    type: 'keyValue',
    description: '控制单个文件上传大小',
    components: [
      {
        name: '单个文件上传大小',
        key: 'filesize',
        type: 'input',
        inputType: 'NUMBER',
        placeholder: '请输入数字',
      },
    ],
    supportType: ['byPage'],
  },
  {
    name: '文件上传指定格式',
    key: 'UploadAccept',
    type: 'keyValue',
    description:
      '针对“上传附件”组件，可以控制其上传固定格式的文件。可配置多种文件格式且不区分大小写，用英文逗号间隔，例如png,crd,txt,AI,pdf,JSON。若不配置，可上传所有格式的文件。',
    components: [
      {
        name: '文件上传指定格式',
        key: 'UploadAccept',
        type: 'input',
        placeholder: '请输入文件格式',
      },
    ],
    supportType: ['byPage'],
  },
  {
    name: '设置输入框提示内容',
    key: 'placeholder',
    type: 'keyValue',
    description:
      '自定义可输入文本框中的提示内容配置后在列表界面的查询字段以及单对象界面均可生效。不配置的话，会显示系统默认的提示内容：“请输入XX”、“请选择XX”。',
    components: [
      {
        name: '设置输入框提示内容',
        key: 'placeholder',
        type: 'input',
        placeholder: '请输入提示内容',
      },
    ],
  },
  {
    name: '不可编辑字段最大显示字数',
    key: 'maxlength',
    type: 'keyValue',
    description: '控制明细列表不可编辑字段最大显示字数',
    components: [
      {
        name: '不可编辑字段最大显示字数',
        key: 'maxlength',
        type: 'input',
        inputType: 'NUMBER',
        placeholder: '请输入数字',
      },
    ],
  },
  {
    name: 'switch开关调用的接口',
    key: 'switchurl',
    type: 'keyValue',
    description: '列表配置switch滑动开关,点击开关按钮调用的接口url',
    components: [
      {
        name: 'switch开关调用的接口',
        key: 'switchurl',
        type: 'input',
        placeholder: '请输入接口url',
      },
    ],
    supportType: ['select'],
  },
  {
    name: '读写规则显示控件',
    key: 'display',
    type: 'keyValue',
    description: '读写规则显示控件',
    components: [
      {
        name: '读写规则显示控件',
        key: 'display',
        type: 'select',
        selectOptions: [{ label: 'enumerate', value: 'enumerate' }],
      },
    ],
  },
  {
    name: '扩展属性显示控件',
    key: 'display',
    type: 'keyValue',
    description: '扩展属性显示控件',
    components: [
      {
        name: '扩展属性显示控件',
        key: 'display',
        type: 'select',
        selectOptions: [{ label: 'jsonmaker', value: 'jsonmaker' }],
      },
    ],
  },
  {
    name: '扩展组件',
    key: 'display',
    type: 'keyValue',
    description:
      '目前支持的类型: 1.YearMonth(年月的日期组件) 2.String(支持展示纯文字和用户定制html内容的组件)。 注意：仅【显示控件】字段值为text或者textarea时，可以配置年月的日期组件',
    components: [
      {
        key: 'display',
        name: '扩展组件',
        type: 'select',
        selectOptions: [
          // { label: 'YearMonth', value: 'YearMonth' }, // 年月日组件。 这个选项会在extensionPropertyWrap.vue的逻辑中动态加入进去
          { label: 'String', value: 'String' }, // 可以innerHTML渲染的组件
        ],
      },
      {
        key: 'styleForString',
        name: '组件style样式',
        type: 'input',
        placeholder: '例如color:red;',
        isShow: function(formData) {
          return formData.display === 'String'
        }, // 决定组件是否显示
      },
    ],
  },
  {
    name: '过滤可配置项',
    key: 'targetField',
    type: 'keyValue',
    description:
      '字段扩展属性根据赋值方式过滤可配置项。对应配置文件中添加supportType',
    components: [
      {
        name: '过滤可配置项',
        key: 'targetField',
        type: 'select',
        selectOptions: [{ label: 'OBTAINMANNER', value: 'OBTAINMANNER' }],
      },
    ],
  },
  {
    name: '静态规则',
    key: 'setAttributes',
    type: 'custom',
    description:
      '根据来源字段的值，控制目标字段是否可编辑、是否必填。注意：字段是否必填和是否不可编辑至少开启其中一个',
    component: 'StaticRules',
  },
  {
    name: '下拉查询传多个字段',
    key: 'refcolvalArray',
    type: 'custom',
    description:
      '外键下拉查询接口传多个字段条件，可配置多组条件字段（意义与关联过滤相似）',
    component: 'RefcolSearch',
    supportType: ['object'],
  },
  {
    name: '对其它字段进行赋值',
    key: 'formRequest',
    type: 'custom',
    description: '根据字段的值对界面其他字段进行赋值。',
    component: 'FormRequest',
    supportType: ['object'],
  },
  {
    name: '根据多个字段过滤',
    key: 'refcolval_custom',
    type: 'custom',
    description:
      '外键关联字段，根据多个来源字段进行过滤。注意：当来源字段来自主表时，字段名前需要加主表表名，格式为“主表表名.字段名”',
    component: 'RefcolFilter',
    supportType: ['object'],
  },
  // {
  //   name: '列表配置单行操作列按钮',
  //   key: 'buttonConfig',
  //   type: 'custom',
  //   description: '列表配置单行操作列按钮',
  //   component: 'OperateColumnButton',
  // },
  {
    name: '所在表格列的宽度',
    key: 'standard_width',
    type: 'input',
    description: '配置表格字段所在列的固定宽度',
  },
  {
    name: '字段选项组值关联过滤',
    key: 'filtercolval',
    type: 'custom',
    description:
      '对于两个字段选项组形式的字段，目标字段的选项 根据来源字段的选项值过滤。',
    component: 'FilterColVal',
    supportType: ['select'],
  },
  {
    name: '是否隐藏表单项的label',
    key: 'hiddenLabel',
    type: 'radio',
    enumerateValue: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    description: '控制查询区表单的label的显示和隐藏',
  },
]
