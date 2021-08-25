import i18n from '../utils/i18n'

const getFieldConfig = function() {
  const config = [
    {
      name: i18n.t('extensionProperty.ifEncrypt'),
      key: 'ispassword',
      type: 'custom',
      component: 'PassWord',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: `${i18n.t('extensionProperty.encryptDisplay')}***`,
      // supportType: ['byPage']
    },
    {
      name: i18n.t('extensionProperty.valueFilter'),
      key: 'refcolval',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.foreignKeyRelatedField'),
          key: 'fixcolumn',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.knownConditionField'),
          key: 'srccol',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.associatedFieldHeader'),
          key: 'maintable',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
      ],
      description: 'B字段根据A字段选择的值过滤出对应条件下的数据',
      supportType: ['object'],
    },
    {
      name: i18n.t('extensionProperty.HRFold'),
      key: 'hrdisplay',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.expand'), value: 'expand' },
        { text: i18n.t('tips.fold'), value: 'fold' },
      ],
      description: i18n.t('extensionProperty.expandAccordToField'),
      supportType: ['trigger'],
    },
    {
      name: i18n.t('extensionProperty.dateType'),
      key: 'datelimit',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.all'), value: 'all' },
        { text: i18n.t('extensionProperty.beforeWithToday'), value: 'before' },
        { text: i18n.t('extensionProperty.afterWithToday'), value: 'after' },
        {
          text: i18n.t('extensionProperty.beforeWithoutToday'),
          value: 'beforetoday',
        },
        {
          text: i18n.t('extensionProperty.afterWithoutToday'),
          value: 'aftertoday',
        },
      ],
      description: i18n.t('extensionProperty.controlDateRange'),
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.linkCustomView'),
      key: 'customerurl',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.customViewAddress'),
          key: 'tableurl',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.popupType'),
          key: 'objdistype',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.associatedFieldName'),
          key: 'refobjid',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.windowName'),
          key: 'reftabdesc',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.associatedTable'),
          key: 'reftablename',
          type: 'input',
        },
        {
          name: `${i18n.t('extensionProperty.associatedTable')} id`,
          key: 'reftableid',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.routeId'),
          key: 'linkname',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.customComponent'),
          key: 'cellcomponent',
          type: 'input',
        },
      ],
      description: i18n.t('extensionProperty.listSpecifiedField'),
      supportType: ['byPage', 'sheetNo', 'select', 'object'],
    },
    {
      name: i18n.t('extensionProperty.virtualCalculatedColumn'),
      key: 'computedcol',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.calculationExpression'),
          key: 'express',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.fieldList'),
          key: 'cols',
          type: 'input',
          outputValueType: 'Array',
        },
        {
          name: i18n.t('extensionProperty.dateFormat'),
          key: 'dformat',
          type: 'input',
        },
      ],
      description: i18n.t('extensionProperty.assignDescription'),
      supportType: ['computed'],
    },
    {
      name: i18n.t('extensionProperty.listTranslation'),
      key: 'refhsfval',
      type: 'input',
      description: i18n.t('extensionProperty.fillPath'),
      supportType: ['object', 'trigger'],
    },
    {
      name: i18n.t('extensionProperty.objectTranslation'),
      key: 'refhsfobjval',
      type: 'input',
      description: i18n.t('extensionProperty.fillPath'),
      supportType: ['object', 'trigger'],
    },
    {
      name: i18n.t('extensionProperty.fieldHide'),
      key: 'hidecolumn',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.influenceColumn'),
          key: 'refcolumn',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.influenceValue'),
          key: 'refval',
          type: 'input',
        },
        {
          name: i18n.t('tips.operator'),
          key: 'expression',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.value'),
          key: 'match',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('extensionProperty.displayValue'), value: 'label' },
            { text: i18n.t('extensionProperty.value'), value: 'value' },
          ],
        },
        {
          name: i18n.t('extensionProperty.ifExecHide'),
          key: 'ishide',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
        {
          name: i18n.t('extensionProperty.keepFieldPosition'),
          key: 'occupied',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
      ],
      description: i18n.t('extensionProperty.determineShow'),
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
      name: i18n.t('extensionProperty.linkageCalculation'),
      key: 'dynamicforcompute',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.calculationExpression'),
          key: 'express',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.relatedField'),
          key: 'refcolumns',
          type: 'input',
          outputValueType: 'Array',
        },
        {
          name: i18n.t('extensionProperty.linkageField'),
          type: 'input',
          key: 'computecolumn',
        },
      ],
      description: i18n.t('extensionProperty.linkageDescription'),
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.intervalConfiguration'),
      key: 'rangecolumn',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.upstreamField'),
          type: 'input',
          key: 'upperlimit',
        },
        {
          name: i18n.t('extensionProperty.downstreamField'),
          type: 'input',
          key: 'lowerlimit',
        },
      ],
      description: i18n.t('extensionProperty.intervalDescription'),
      supportType: ['trigger'],
    },
    {
      name: i18n.t('extensionProperty.ifFilterField'),
      key: 'must_be_active',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.onlyISACTIVE'),
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
      name: i18n.t('extensionProperty.cachedTransition'),
      key: 'needcache',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.cacheRule'),
      supportType: ['object', 'computed', 'trigger'],
    },
    {
      name: i18n.t('extensionProperty.cacheTime'),
      key: 'refremotecachetimeout',
      type: 'input',
      inputType: 'Number',
      description: i18n.t('extensionProperty.cacheDescription'),
      supportType: ['object', 'computed', 'trigger'],
    },
    {
      name: i18n.t('extensionProperty.permissionConfiguration'),
      key: 'precollist',
      type: 'object-group',
      showLabel: false,
      objectInfo: [
        {
          name: i18n.t('extensionProperty.dataPermissionSign'),
          key: 'premtype',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.fieldInSourceTable'),
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
      description: i18n.t('extensionProperty.permissionDescription'),
      supportType: ['object'],
    },
    {
      name: i18n.t('extensionProperty.singlePermissionConfiguration'),
      key: 'precolobj',
      type: 'object-group',
      showLabel: false,
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
      description: i18n.t('extensionProperty.singlePermissionDescription'),
      supportType: ['object'],
    },
    {
      name: i18n.t('extensionProperty.storePermissionConfiguration'),
      key: 'refcolprem',
      type: 'object-group',
      showLabel: false,
      objectInfo: [
        {
          name: i18n.t('extensionProperty.dataPermissionSign'),
          key: 'premtype',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.masterAuthority'),
          key: 'srccol',
          type: 'input',
        },
        {
          name: i18n.t('extensionProperty.fieldInSourceTable'),
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
      description: i18n.t('extensionProperty.storePermissionDescription'),
      supportType: ['object'],
    },
    {
      name: i18n.t('extensionProperty.listQueryRule'),
      key: 'queryrule',
      type: 'input-group',
      inputLists: [
        {
          name: i18n.t('extensionProperty.matchRule'),
          key: 'matchrule',
          type: 'select',
          selectOptions: [
            { text: `-- ${i18n.t('tips.pleaseSelect')} --`, value: '' },
            { text: i18n.t('extensionProperty.fullMatch'), value: '0' },
            { text: i18n.t('extensionProperty.leftMatch'), value: '1' },
            { text: i18n.t('extensionProperty.rightMatch'), value: '2' },
            { text: i18n.t('extensionProperty.fullBlur'), value: '3' },
          ],
        },
        {
          name: i18n.t('extensionProperty.queryIsRequired'),
          key: 'required',
          type: 'radio',
          enumerateValue: [
            { text: i18n.t('tips.yes'), value: true },
            { text: i18n.t('tips.no'), value: false },
          ],
        },
      ],
      description: i18n.t('extensionProperty.listQueryRule'),
    },
    {
      name: i18n.t('extensionProperty.enableVerification'),
      key: 'preverifyenabled',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.verificationDescription'),
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
      name: i18n.t('extensionProperty.isdefaultField'),
      key: 'ignoreDisableWhenEdit',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.isdefaultDescription'),
    },
    {
      name: i18n.t('extensionProperty.clearWhenHidden'),
      key: 'clearWhenHidden',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.clearDescription'),
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
      name: i18n.t('extensionProperty.linkJump'),
      key: 'Outside',
      type: 'keyValue',
      description: i18n.t('extensionProperty.linkJumpDescription'),
      components: [
        {
          name: i18n.t('extensionProperty.linkJump'),
          key: 'Outside',
          type: 'input',
          placeholder: i18n.t('extensionProperty.enterLink'),
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.forbiddenNegativeSign'),
      key: 'ispositive',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.forbiddenNegativeSignDesc'),
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.uploadNumber'),
      key: 'ImageSize',
      type: 'keyValue',
      description: i18n.t('extensionProperty.uploadNumberDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.uploadNumber'),
          key: 'ImageSize',
          type: 'input',
          inputType: 'NUMBER',
          placeholder: i18n.t('extensionProperty.enterNumber'),
        },
      ],
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.fileUploadNumber'),
      key: 'filesLength',
      type: 'keyValue',
      description: i18n.t('extensionProperty.fileUploadNumberDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.fileUploadNumber'),
          key: 'filesLength',
          type: 'input',
          inputType: 'NUMBER',
          placeholder: i18n.t('extensionProperty.enterNumber'),
        },
      ],
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.fileUploadSize'),
      key: 'filesize',
      type: 'keyValue',
      description: i18n.t('extensionProperty.fileUploadSizeDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.fileUploadSize'),
          key: 'filesize',
          type: 'input',
          inputType: 'NUMBER',
          placeholder: i18n.t('extensionProperty.enterNumber'),
        },
      ],
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.fileUploadFormat'),
      key: 'UploadAccept',
      type: 'keyValue',
      description: i18n.t('extensionProperty.fileUploadFormatDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.fileUploadFormat'),
          key: 'UploadAccept',
          type: 'input',
          placeholder: i18n.t('extensionProperty.enterFileFormat'),
        },
      ],
      supportType: ['byPage'],
    },
    {
      name: i18n.t('extensionProperty.setInputPrompt'),
      key: 'placeholder',
      type: 'keyValue',
      description: i18n.t('extensionProperty.setInputPromptDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.setInputPrompt'),
          key: 'placeholder',
          type: 'input',
          placeholder: i18n.t('extensionProperty.enterPrompt'),
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.maximumChar'),
      key: 'maxlength',
      type: 'keyValue',
      description: i18n.t('extensionProperty.maximumCharDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.maximumChar'),
          key: 'maxlength',
          type: 'input',
          inputType: 'NUMBER',
          placeholder: i18n.t('extensionProperty.enterNumber'),
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.switchApi'),
      key: 'switchurl',
      type: 'keyValue',
      description: i18n.t('extensionProperty.switchApiDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.switchApi'),
          key: 'switchurl',
          type: 'input',
          placeholder: i18n.t('extensionProperty.enterApi'),
        },
      ],
      supportType: ['select'],
    },
    {
      name: i18n.t('extensionProperty.readWriteDisplay'),
      key: 'display',
      type: 'keyValue',
      description: i18n.t('extensionProperty.readWriteDisplay'),
      components: [
        {
          name: i18n.t('extensionProperty.readWriteDisplay'),
          key: 'display',
          type: 'select',
          selectOptions: [{ label: 'enumerate', value: 'enumerate' }],
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.displayControl'),
      key: 'display',
      type: 'keyValue',
      description: i18n.t('extensionProperty.displayControl'),
      components: [
        {
          name: i18n.t('extensionProperty.displayControl'),
          key: 'display',
          type: 'select',
          selectOptions: [{ label: 'jsonmaker', value: 'jsonmaker' }],
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.expansionComponent'),
      key: 'display',
      type: 'keyValue',
      description: i18n.t('extensionProperty.expansionComponentDesc'),
      components: [
        {
          key: 'display',
          name: i18n.t('extensionProperty.expansionComponent'),
          type: 'select',
          selectOptions: [
            // { label: 'YearMonth', value: 'YearMonth' }, // 年月日组件。 这个选项会在extensionPropertyWrap.vue的逻辑中动态加入进去
            { label: 'String', value: 'String' }, // 可以innerHTML渲染的组件
          ],
        },
        {
          key: 'styleForString',
          name: i18n.t('extensionProperty.componentStyle'),
          type: 'input',
          placeholder: i18n.t('extensionProperty.stylePlaceholder'),
          isShow: function(formData) {
            return formData.display === 'String'
          }, // 决定组件是否显示
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.filterConfig'),
      key: 'targetField',
      type: 'keyValue',
      description: i18n.t('extensionProperty.filterConfigDesc'),
      components: [
        {
          name: i18n.t('extensionProperty.filterConfig'),
          key: 'targetField',
          type: 'select',
          selectOptions: [{ label: 'OBTAINMANNER', value: 'OBTAINMANNER' }],
        },
      ],
    },
    {
      name: i18n.t('extensionProperty.staticRule'),
      key: 'setAttributes',
      type: 'custom',
      description: i18n.t('extensionProperty.staticRuleDesc'),
      component: 'StaticRules',
    },
    {
      name: i18n.t('extensionProperty.passMutiFields'),
      key: 'refcolvalArray',
      type: 'custom',
      description: i18n.t('extensionProperty.passMutiFieldsDesc'),
      component: 'RefcolSearch',
      supportType: ['object'],
    },
    {
      name: i18n.t('extensionProperty.assignValues'),
      key: 'formRequest',
      type: 'custom',
      description: i18n.t('extensionProperty.assignValueDesc'),
      component: 'FormRequest',
      supportType: ['object'],
    },
    {
      name: i18n.t('extensionProperty.filterBaseOnField'),
      key: 'refcolval_custom',
      type: 'custom',
      description: i18n.t('extensionProperty.filterBaseOnFieldDesc'),
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
      name: i18n.t('extensionProperty.columnWidth'),
      key: 'standard_width',
      type: 'input',
      description: i18n.t('extensionProperty.columnWidthDesc'),
    },
    {
      name: i18n.t('extensionProperty.groupFilter'),
      key: 'filtercolval',
      type: 'custom',
      description: i18n.t('extensionProperty.groupFilterDesc'),
      component: 'FilterColVal',
      supportType: ['select'],
    },
    {
      name: i18n.t('extensionProperty.hideLabel'),
      key: 'hiddenLabel',
      type: 'radio',
      enumerateValue: [
        { text: i18n.t('tips.yes'), value: true },
        { text: i18n.t('tips.no'), value: false },
      ],
      description: i18n.t('extensionProperty.hideLabelDesc'),
    },
  ]
  return config
}

export default getFieldConfig
