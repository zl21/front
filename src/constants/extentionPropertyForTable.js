export default [
  {
    name: '列表默认排序',
    key: 'orderby',
    type: 'object-group',
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
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '弹框多选',
    key: '__root__',
    type: 'input-group',
    inputLists: [
      {
        name: '全局检索自动匹配字段',
        key: 'multiCenter',
        type: 'input',
        outputValueType: 'Array'
      },
      {
        name: '全局检索字段',
        key: 'multiIndex',
        type: 'input',
        outputValueType: 'Array'
      },
      {
        name: '中间展示字段',
        key: 'multiColumn',
        type: 'input',
        outputValueType: 'Array'
      },
      {
        name: '左侧字段',
        key: 'multiFilter',
        type: 'input',
        outputValueType: 'Array'
      },
    ],
    description: '请描述一下这个配置有啥作用'
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
        type: 'input',
      }
    ],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '外键下拉',
    key: 'fkdrplist',
    type: 'object-combine',
    enableIncrease: true,
    objectInfo: [
      {
        name: '排序信息',
        key: 'orderby',
        type: 'object-group',
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
        name: '下拉弹出显示列',
        key: 'searchcols',
        type: 'input',
        outputValueType: 'Array'
      }
    ],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '输入键查询',
    key: 'ak2',
    type: 'input',
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '导出',
    key: 'DisableEXPORT',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '导入',
    key: 'smalltable',
    type: 'radio',
    enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '商品数量矩阵配置',
    key: '__root__',
    type: 'input-group',
    inputLists: [
      {
        name: '对应字段名1',
        key: 'pdtcol',
        type: 'input'
      },
      {
        name: '对应字段名2',
        key: 'qtycol',
        type: 'input'
      },
      {
        name: '是否显示数量',
        key: 'qtyisshow',
        type: 'radio',
        enumerateValue: [{ text: '是', value: true }, { text: '否', value: false }],
      },
      {
        name: '扫描数量',
        key: 'defnum',
        type: 'input',
        inputType: 'Number'
      },
    ],
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '按钮显示',
    key: 'filteracshow',
    type: 'object-group',
    objectInfo: [
      {
        name: '按钮名称',
        key: 'ackey',
        type: 'select',
        selectOptions: [
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
    description: '请描述一下这个配置有啥作用'
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
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '水印图片优先级',
    key: 'wkprioritys',
    type: 'input',
    outputValueType: 'Array',
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '列表样式优先级',
    key: 'status4css_priority',
    type: 'input',
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '下拉列表显示行数',
    key: 'listrange',
    type: 'input',
    inputType: 'Number',
    description: '请描述一下这个配置有啥作用'
  },
  {
    name: '列表定制查询',
    key: 'cusQResult',
    type: 'input-group',
    inputLists: [
      {
        name: '服务名',
        key: 'action'
      }
    ],
    description: '请描述一下这个配置有啥作用'
  },
];
