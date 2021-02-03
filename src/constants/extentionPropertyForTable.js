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
  {
    name: '前端自定义参数',
    key: 'webconf',
    type: 'input',
    outputValueType: 'JSON',
    description: '自定义参数格式及内容'
  },
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
    name: '列表查询tab配置',
    key: 'multi_tab_conf',
    type: 'custom',
    component: 'MultiTab',
    showLabel: false,
    enableIncrease: true,
    description: '增加列表的查询tab页配置'
  },
  {
    name: '关联字段组配置',
    key: 'key_group_conf',
    type: 'custom',
    component: 'bindKey',
    showLabel: false,
    enableIncrease: true,
    description: '增加关联字段的配置'
  },
];
