import i18n from '../utils/i18n'

const getTableConfig = function() {
  const config = [
    {
      name: i18n.t('extensionProperty.listDefaultSort'),
      key: 'orderby',
      type: 'object-group',
      showLabel: false,
      enableIncrease: true,
      objectInfo: [
        {
          name: i18n.t('extensionProperty.fieldName'),
          key: 'column',
          type: 'input',
        },
        {
          name: i18n.t('tips.ascending'),
          key: 'asc',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
      ],
      description: i18n.t('extensionProperty.sortDesc'),
    },
    {
      name: i18n.t('mopMultiSelect.multiplePop'),
      key: '__root__',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.globalSearchField'),
          key: 'multiIndex',
          type: 'object-group',
          showLabel: true,
          enableIncrease: true,
          objectInfo: [
            {
              name: i18n.t('extensionProperty.fieldName'),
              key: 'colName',
              type: 'input',
            },
            {
              name: i18n.t('extensionProperty.fuzzyMatching'),
              key: 'matchType',
              type: 'radio',
              enumerateValue: [
                { text: i18n.t('extensionProperty.fullBlur'), value: '%X%' },
                { text: i18n.t('extensionProperty.rightBlur'), value: 'X%' },
                { text: i18n.t('extensionProperty.leftBlur'), value: '%X' },
              ],
            },
          ],
        },
        {
          name: i18n.t('extensionProperty.globalAutoSearch'),
          key: 'multiCenter',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.middleField'),
          key: 'multiColumn',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.leftField'),
          key: 'multiFilter',
          type: 'input',
          outputValueType: 'Array',
        },
      ],
      description: i18n.t('extensionProperty.multiPopDesc'),
    },
    {
      name: i18n.t('extensionProperty.fuzzyMatching'),
      key: 'fuzzyQuery',
      type: 'object-group',
      enableIncrease: true,
      objectInfo: [
        {
          name: i18n.t('extensionProperty.fieldName'),
          key: 'colName',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.fuzzyMatching'),
          key: 'matchType',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('extensionProperty.fullBlur'), value: '%X%' },
            { text: i18n.t('extensionProperty.rightBlur'), value: 'X%' },
            { text: i18n.t('extensionProperty.leftBlur'), value: '%X' },
          ],
        },
      ],
      description: i18n.t('extensionProperty.fuzzyDesc'),
    },
    {
      name: i18n.t('extensionProperty.foreignDropdownList'),
      key: 'fkdrplist',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.sortInfo'),
          key: 'orderby',
          type: 'object-group',
          showLabel: true,
          enableIncrease: true,
          objectInfo: [
            {
              name: i18n.t('extensionProperty.fieldName'),
              key: 'column',
              type: 'input',
            },
            {
              name: i18n.t('tips.ascending'),
              key: 'asc',
              type: 'radio',
              enumerateValue: [
                { text: i18n.t('tips.yes'), value: true },
                { text: i18n.t('tips.no'), value: false },
              ],
            },
          ],
        },
        {
          name: i18n.t('extensionProperty.dropdownListColumn'),
          key: 'searchcols',
          type: 'input',
          outputValueType: 'Array',
        },
      ],
      description: i18n.t('extensionProperty.dropdownListDesc'),
    },
    {
      name: i18n.t('extensionProperty.enterFieldQuery'),
      key: 'ak2',
      type: 'input',
      description: i18n.t('extensionProperty.fieldQueryDesc'),
    },
    {
      name: i18n.t('extensionProperty.hiddenExportInDetail'),
      key: 'DisableEXPORT',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.hiddenExportDesc'),
    },
    {
      name: i18n.t('extensionProperty.foreignOptional'),
      key: 'smalltable',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.foreignOptionalDesc'),
    },
    {
      name: i18n.t('extensionProperty.buttonDisplay'),
      key: 'filteracshow',
      type: 'object-group',
      objectInfo: [
        {
          name: i18n.t('extensionProperty.buttonName'),
          key: 'ackey',
          type: 'select',
          selectOptions: [
            { text: `-- ${i18n.t('tips.pleaseSelect')} --`, value: '' },
            { text: i18n.t('tips.add'), value: 'actionADD' },
            { text: i18n.t('tips.modify'), value: 'actionMODIFY' },
            { text: i18n.t('tips.delete'), value: 'ctionDELETE' },
            { text: i18n.t('tips.submit'), value: 'actionSUBMIT' },
            { text: i18n.t('tips.cancelSubmission'), value: 'actionUNSUBMIT' },
            { text: i18n.t('tips.invalid'), value: 'actionVOID' },
            { text: i18n.t('tips.copy'), value: 'actionCANCOPY' },
            { text: i18n.t('tips.import'), value: 'actionIMPORT' },
            { text: i18n.t('tips.export'), value: 'actionEXPORT' },
            { text: i18n.t('tips.print'), value: 'actionPRINT' },
          ],
        },
        {
          name: i18n.t('extensionProperty.displayCondition'),
          key: 'sqlfilter',
          type: 'input',
        },
      ],
      description: i18n.t('extensionProperty.buttonDisplayDesc'),
    },
    {
      name: i18n.t('extensionProperty.readOnlyStatus'),
      key: 'pstatus',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.fieldName'),
          key: 'col',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.value'),
          key: 'readforvals',
          type: 'input',
          outputValueType: 'Array',
        },
      ],
      description: i18n.t('extensionProperty.readOnlyStatusDesc'),
    },
    {
      name: i18n.t('extensionProperty.watermarkPriority'),
      key: 'wkprioritys',
      type: 'input',
      outputValueType: 'Array',
      description: i18n.t('extensionProperty.watermarkPriorityDesc'),
    },
    {
      name: i18n.t('extensionProperty.mergeQuery'),
      key: 'integrationstatus',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.mergedQueryField'),
          type: 'input',
          key: 'name',
        },
        {
          name: i18n.t('extensionProperty.mergeField'),
          key: 'status',
          type: 'input',
          outputValueType: 'Array',
        },
      ],
      description: i18n.t('extensionProperty.mergeQueryDesc'),
    },
    {
      name: i18n.t('extensionProperty.stylePriority'),
      key: 'status4css_priority',
      type: 'input',
      description: i18n.t('extensionProperty.stylePriorityDesc'),
    },
    {
      name: i18n.t('extensionProperty.displayRows'),
      key: 'listrange',
      type: 'input',
      inputType: 'Number',
      description: i18n.t('extensionProperty.displayRowsDesc'),
    },
    {
      name: i18n.t('extensionProperty.showAction'),
      key: 'showaction',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.showActionDesc'),
    },
    {
      name: i18n.t('extensionProperty.listCustomQuery'),
      key: 'cusQResult',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.serverName'),
          key: 'action',
          type: 'input',
        },
      ],
      description: i18n.t('extensionProperty.listCustomQueryDesc'),
    },
    {
      name: i18n.t('extensionProperty.treeViewConfig'),
      key: 'menudisplay',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('extensionProperty.treeView'), value: 'tree' },
      ],
      description: i18n.t('extensionProperty.treeViewConfigDesc'),
    },
    // {
    //   name: '前端自定义参数',
    //   key: 'webconf',
    //   type: 'input',
    //   outputValueType: 'JSON',
    //   description: '自定义参数格式及内容'
    // },
    {
      name: i18n.t('extensionProperty.listDataPermission'),
      key: 'precolnameslist',
      type: 'object-group',
      showLabel: false,
      enableIncrease: true,
      objectInfo: [
        {
          name: i18n.t('extensionProperty.dataPermissionSign'),
          key: 'premtype',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.fieldInThisTable'),
          key: 'refcol',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.getEditPermission'),
          key: 'iswrite',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
      ],
      description: i18n.t('extensionProperty.listDataPermissionDesc'),
    },
    {
      name: i18n.t('extensionProperty.detailDataPermission'),
      key: 'precolnames',
      type: 'object-group',
      showLabel: false,
      enableIncrease: true,
      objectInfo: [
        {
          name: i18n.t('extensionProperty.dataPermissionSign'),
          key: 'premtype',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.fieldInThisTable'),
          key: 'refcol',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.getEditPermission'),
          key: 'iswrite',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
      ],
      description: i18n.t('extensionProperty.detailDataPermissionDesc'),
    },
    {
      name: i18n.t('extensionProperty.setNormalList'),
      key: 'commonTable',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.setNormalListDesc'),
    },
    {
      name: i18n.t('extensionProperty.enableDynamicRoute'),
      key: 'dynamicRouting',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.enableDynamicRouteDesc'),
    },
    {
      name: i18n.t('extensionProperty.displayTemporaryStorageButton'),
      key: 'temp_storage',
      type: 'object-value',
      components: [
        {
          name: i18n.t('extensionProperty.openTemporaryStorageService'),
          key: 'isenable',
          type: 'radio',
          defaultValue: false, // 给配置表单项的默认值
          isClearConfig: true, // 该key符合canClear()条件时，清空整个配置
          canClear: function(formData) {
            return !formData.isenable
          }, // canClear作用是当前key符合函数条件时，为true,会清空对应的字段值(也可能是整个配置对象)
          options: {
            defaultValue: i18n.t('tips.no'), // 给子组件用的默认值
            selectOptions: [
              {
                value: true,
                label: i18n.t('tips.yes'),
              },
              {
                value: false,
                label: i18n.t('tips.no'),
              },
            ],
          },
        },
        {
          name: i18n.t('extensionProperty.generalApi'),
          key: 'path',
          type: 'input',
          isClearConfig: true,
          canClear: function(formData) {
            return !formData.path
          },
          defaultValue: '',
          placeholder: i18n.t('extensionProperty.enterApi'),
        },
      ],
      description: i18n.t('extensionProperty.displayTemporaryStorageDesc'),
    },
    {
      name: i18n.t('extensionProperty.hideMainTable'),
      key: 'isCustomizeTab',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.hideMainTableDesc'),
    },
    {
      name: i18n.t('extensionProperty.hideImport'),
      key: 'disableImport',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.hideImportDesc'),
    },
    {
      name: i18n.t('extensionProperty.hideExport'),
      key: 'disableExport',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.hideExportDesc'),
    },
    {
      name: i18n.t('extensionProperty.storeQuery'),
      key: 'enableKAQueryDataForUser',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.storeQueryDesc'),
    },
    {
      name: i18n.t('extensionProperty.tabConfig'),
      key: 'multi_tab_conf',
      type: 'custom',
      component: 'MultiTab',
      showLabel: false,
      description: i18n.t('extensionProperty.tabConfigDesc'),
    },
    {
      name: i18n.t('extensionProperty.billMarkConfig'),
      key: 'key_group_conf',
      type: 'custom',
      component: 'BindKey',
      showLabel: false,
      description: i18n.t('extensionProperty.billMarkConfigDesc'),
    },
    {
      name: i18n.t('extensionProperty.buttonDisableCondition'),
      key: 'listbutton_filter_conf',
      type: 'custom',
      component: 'DisableButton',
      showLabel: false,
      description: i18n.t('extensionProperty.buttonDisableConditionDesc'),
    },
    {
      name: i18n.t('extensionProperty.queryPreOperation'),
      key: 'querypretrigger',
      type: 'input',
      description: i18n.t('extensionProperty.queryPreOperationDesc'),
    },
    {
      name: i18n.t('extensionProperty.tablePinnedColumn'),
      key: 'pinnedColumns',
      type: 'custom',
      component: 'PinnedColumns',
      description: i18n.t('extensionProperty.tablePinnedColumnDesc'),
    },
    {
      name: i18n.t('extensionProperty.subTableDisplay'),
      key: 'hiddenSubtable',
      type: 'custom',
      description: i18n.t('extensionProperty.subTableDisplayDesc'),
      component: 'HiddenSubtable',
    },
  ]
  return config
}

export default getTableConfig
