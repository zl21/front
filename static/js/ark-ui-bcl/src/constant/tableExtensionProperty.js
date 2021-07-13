export default [
  {
    name: '列表默认排序',
    key: 'orderby',
    type: 'object-group',
    showLabel: false,
    enableIncrease: true,
    objectInfo: [
      {
        name: '字段名称',
        key: 'column',
        type: 'input'
      },
      {
        name: '升序',
        key: 'asc',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
      }
    ],
    description: '进入列表界面之后，列表中的数据默认排序方式配置'
  },
  {
    name: '弹框多选',
    key: '__root__',
    type: 'input-group',
    inputLists: [
      {
        name: '全局检索字段',
        key: 'multiIndex',
        type: 'object-group',
        showLabel: true,
        enableIncrease: true,
        objectInfo: [
          {
            name: '字段名称',
            key: 'colName',
            type: 'input'
          },
          {
            name: '模糊匹配方式',
            key: 'matchType',
            type: 'radio',
            enumerateValue: [{ text: '全模糊', value: '%X%' }, { text: '右模糊', value: 'X%' }, { text: '左模糊', value: '%X' }],
          }
        ]
      },
      {
        name: '全局检索自动匹配字段',
        key: 'multiCenter',
        type: 'input'
      },
      {
        name: '中间展示字段',
        key: 'multiColumn',
        type: 'input'
      },
      {
        name: '左侧字段',
        key: 'multiFilter',
        type: 'input',
        outputValueType: 'Array'
      },
    ],
    description: '复杂弹窗多选的配置'
  },
  {
    name: '模糊匹配',
    key: 'fuzzyQuery',
    type: 'object-group',
    enableIncrease: true,
    objectInfo: [
      {
        name: '字段名称',
        key: 'colName',
        type: 'input'
      },
      {
        name: '模糊匹配方式',
        key: 'matchType',
        type: 'radio',
        enumerateValue: [{ text: '全模糊', value: '%X%' }, { text: '右模糊', value: 'X%' }, { text: '左模糊', value: '%X' }],
      }
    ],
    description: '用户手工输入进行模糊匹配，模糊匹配的列按照顺序配置'
  },
  {
    name: '外键下拉列表',
    key: 'fkdrplist',
    type: 'input-group',
    inputLists: [
      {
        name: '排序信息',
        key: 'orderby',
        type: 'object-group',
        showLabel: true,
        enableIncrease: true,
        objectInfo: [
          {
            name: '字段名称',
            key: 'column',
            type: 'input'
          },
          {
            name: '升序',
            key: 'asc',
            type: 'radio',
            enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
          }
        ]
      },
      {
        name: '下拉列表显示列',
        key: 'searchcols',
        type: 'input',
        outputValueType: 'Array'
      }
    ],
    description: '外键关联字段，下拉窗口，指定显示的列、指定用于数据排序的列'
  },
  {
    name: '输入键查询字段',
    key: 'ak2',
    type: 'input',
    description: '指定为AK2的字段可用于在列名界面进行查询'
  },
  {
    name: '明细表不显示导出按钮',
    key: 'DisableEXPORT',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '表的数据由定制服务查询写入，而非标准的数据，不支持导出，则可隐藏导出按钮'
  },
  {
    name: '导入模板外键字段可选择',
    key: 'smalltable',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '配置后导入模板中外键关联字段可根据关联表中的记录下拉选择'
  },
  {
    name: '单对象按钮显示',
    key: 'filteracshow',
    type: 'object-group',
    objectInfo: [
      {
        name: '按钮名称',
        key: 'ackey',
        type: 'select',
        selectOptions: [
          { text: '-- 请选择 --', value: '' },
          { text: '新增', value: 'actionADD' },
          { text: '修改', value: 'actionMODIFY' },
          { text: '删除', value: 'ctionDELETE' },
          { text: '提交', value: 'actionSUBMIT' },
          { text: '取消提交', value: 'actionUNSUBMIT' },
          { text: '作废', value: 'actionVOID' },
          { text: '复制', value: 'actionCANCOPY' },
          { text: '导入', value: 'actionIMPORT' },
          { text: '导出', value: 'actionEXPORT' },
          { text: '打印', value: 'actionPRINT' },
        ]
      },
      {
        name: '显示条件',
        key: 'sqlfilter',
        type: 'input',
      }
    ],
    description: '单对象支持指定按钮在不同场景下是否显示'
  },
  {
    name: '只读状态',
    key: 'pstatus',
    type: 'input-group',
    inputLists: [
      {
        name: '字段名',
        key: 'col',
        type: 'input'
      },
      {
        name: '字段值',
        key: 'readforvals',
        type: 'input',
        outputValueType: 'Array'
      }
    ],
    description: '表的某一字段的值控制数据只读，不可以编辑'
  },
  {
    name: '水印图片优先级',
    key: 'wkprioritys',
    type: 'input',
    outputValueType: 'Array',
    description: '直接配置字段名，中越往后的字段优先级越高'
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
    name: '列表样式优先级',
    key: 'status4css_priority',
    type: 'input',
    description: '直接配置a>b>c，其中a,b,c为字段名'
  },
  {
    name: '下拉列表显示行数',
    key: 'listrange',
    type: 'input',
    inputType: 'Number',
    description: '外键关联下拉列表每页显示行数'
  },
  {
    name: '新增界面可显示动作定义',
    key: 'showaction',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '新增单对象可显示符合显示条件的动作定义按钮'
  },
  {
    name: '列表定制查询',
    key: 'cusQResult',
    type: 'input-group',
    inputLists: [
      {
        name: '服务名',
        key: 'action',
        type: 'input'
      }
    ],
    description: '表的数据由定制服务查询写入，而非标准的数据'
  },
  {
    name: '树界面配置',
    key: 'menudisplay',
    type: 'radio',
    enumerateValue: [{ text: '树界面', value: 'tree' }],
    description: '列表界面使用树界面'
  },
  // {
  //   name: '前端自定义参数',
  //   key: 'webconf',
  //   type: 'input',
  //   outputValueType: 'JSON',
  //   description: '自定义参数格式及内容'
  // },
  {
    name: '列表数据权限配置',
    key: 'precolnameslist',
    type: 'object-group',
    showLabel: false,
    enableIncrease: true,
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
    description: '控制列表界面过滤的数据，以及列表界面查询条件可以选到的数据（只检查读权限）'
  },
  {
    name: '单对象数据权限配置',
    key: 'precolnames',
    type: 'object-group',
    showLabel: false,
    enableIncrease: true,
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
    description: '控制单对象界面是否可编辑（只检查写权限）'
  },
  {
    name: '列表查询前置操作',
    key: 'querypretrigger',
    type: 'input',
    description: '支持表扩展属性查询条件前配置。目前可填入的字段有：text',
  },
  {
    name: '设置成普通列表',
    key: 'commonTable',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '将列表设置成普通列表（非AG）',
  },
  {
    name: '开启动态路由',
    key: 'dynamicRouting',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '实现效果:双击表中的明细记录，则将携带参数OBJID跳转到TABLENAME中存储的表的单对象界面',
  },
  {
    name: '是否展示暂存按钮',
    key: 'temp_storage',
    type: 'object-value',
    components: [
      {
        name: '是否开启暂存服务',
        key: 'isenable',
        type: 'radio',
        defaultValue: false, // 给配置表单项的默认值
        isClearConfig: true, // 该key符合canClear()条件时，清空整个配置
        canClear: function(formData) {
          return !formData.isenable
        }, // canClear作用是当前key符合函数条件时，为true,会清空对应的字段值(也可能是整个配置对象)
        options: {
          defaultValue: '否', // 给子组件用的默认值
          selectOptions: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            },
          ]
        },
      },
      {
        name: '通用服务http接口',
        key: 'path',
        type: 'input',
        isClearConfig: true,
        canClear: function(formData) {
          return !formData.path
        },
        defaultValue: '',
        placeholder: '请输入接口地址，例如/p/cs/objectSave'
      },
    ],
    description: '实现效果:单对象界面显示【暂存】按钮，点击时前端不做必填校验',
  },
  {
    name: '左右结构隐藏主表',
    key: 'isCustomizeTab',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '实现效果:只针对左右结构的单对象，且第一个子表为定制界面（明细菜单）时，可隐藏主表',
  },
  {
    name: '隐藏导入按钮',
    key: 'disableImport',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '实现效果:隐藏标准列表界面的导入按钮',
  },
  {
    name: '隐藏导出按钮',
    key: 'disableExport',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '实现效果:隐藏标准列表界面的导出按钮',
  },
  {
    name: '存储查询条件',
    key: 'enableKAQueryDataForUser',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '实现效果:标准列表界面根据查询条件查询后，关闭页面再打开时，会存储上一次的查询条件一定时间（默认一天）。注意：此项配置只在前端配置中的开关关闭的时候才有效（前端开关开启的话，不配置也会存储；且此时配置false无效）。弹框多选以及状态合并查询，不会进行存储；有默认值的查询字段，即使修改条件后再打开页面，也会优先显示设置的默认值。',
  },
  {
    name: '列表查询tab配置',
    key: 'multi_tab_conf',
    type: 'custom',
    component: 'MultiTab',
    showLabel: false,
    description: '增加列表的查询tab页配置。字段生效规则: 标签名存在 + 该标签下至少有一条有效条件(同一行的 关联字段+运算符+对比值 都有值)，则视为有效数据。PS:标签组支持长按拖拽排序'
  },
  {
    name: '单据标记配置',
    key: 'key_group_conf',
    type: 'custom',
    component: 'BindKey',
    showLabel: false,
    description: '增加单据标记的配置。字段生效规则: 展示区域字段存在 + 展示区域字段下至少有一条有效条件(同一行的 来源字段+来源字段选项组 都有值)，则视为有效数据。PS:每个展示区域字段组都支持长按拖拽排序'
  },
  {
    name: '按钮禁用条件',
    key: 'listbutton_filter_conf',
    type: 'custom',
    component: 'DisableButton',
    showLabel: false,
    description: '增加按钮禁用条件的配置'
  },
  {
    name: '列表查询前置操作',
    key: 'querypretrigger',
    type: 'input',
    description: '支持表扩展属性查询条件前配置。目前可填入的字段有：text',
  },
  {
    name: '表格固定列',
    key: 'pinnedColumns',
    type: 'custom',
    component: 'PinnedColumns',
    description: '设置表格固定列的展示。该配置返回的格式为xx|xx，其中竖线左侧的字段代表固定在左侧的列，竖线右侧的字段代表固定在右侧的列'
  },
  {
    name: '控制子表显示或隐藏',
    key: 'hiddenSubtable',
    type: 'custom',
    description:
      '当主表字段等于某个值时，隐藏指定子表',
    component: 'HiddenSubtable',
  },
];
