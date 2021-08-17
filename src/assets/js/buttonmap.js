import i18n from './i18n'

const buttonmap = {
  LOADING: () => {
    return i18n.t('tips.serverProcessing')
  },
  CATEGORY_GUIDE: () => {
    return i18n.t('tips.categoryNavigation')
  },
  MAINTAIN_BY_SYS: () => {
    return i18n.t('tips.systemMaintenance')
  },
  TIME_OUT: () => {
    return i18n.t('tips.operationTimeout')
  },
  NO_DATA_TO_PROCESS: () => {
    return i18n.t('messages.noDataProcess')
  },
  DO_YOU_CONFIRM_DELETE: () => {
    return i18n.t('messages.confirmDelete')
  },
  DO_YOU_CONFIRM_SUBMIT: () => {
    return i18n.t('messages.confirmSubmit')
  },
  DO_YOU_CONFIRM_GROUPSUBMIT: () => {
    return i18n.t('messages.mergeSubmit')
  },
  NO_PERMISSION: () => {
    return i18n.t('tips.noPermission')
  },
  EXCEPTION: () => {
    return i18n.t('tips.abnormal')
  },
  PLEASE_SWITCH_TO_MODIFY_VIEW: () => {
    return i18n.t('messages.switchEditInterfaceFirst')
  },
  MODIFY_VIEW: () => {
    return i18n.t('messages.switchEditInterface')
  },
  READ_ONLY_VIEW: () => {
    return i18n.t('messages.switchReadOnlyInterface')
  },
  PLEASE_SELECT_LINES_LESS_THAN: () => {
    return i18n.t('messages.selectLessData')
  },
  MORE_COMMANDS: () => {
    return i18n.t('tips.more')
  },
  // CMD_PRINT_SELECT: {
  //   name: '选中打印',
  //   icon: '',
  //   defbutton: null,
  //   action: '',
  // },
  CMD_PRINT: {
    name: () => {
      return i18n.t('buttons.print')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_REPORT: {
    name: () => {
      return i18n.t('tips.report')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_BACK: {
    name: () => {
      return i18n.t('buttons.back')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_GROUPSUBMIT: {
    name: () => {
      return i18n.t('buttons.bulkSubmission')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_GROUPMODIFY: {
    name: () => {
      return i18n.t('buttons.batchEdit')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_EXPORT: {
    name: () => {
      return i18n.t('buttons.export')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_ADD: {
    name: () => {
      return i18n.t('buttons.add')
    },
    icon: '',
    defbutton: 'S',
    action: '',
  },
  // CMD_CANCOPY: {
  //   name: '复制',
  //   icon: '',
  //   defbutton: '',
  //   action: '',
  // },
  CMD_MODIFY: {
    name: () => {
      return i18n.t('buttons.save')
    },
    icon: '',
    defbutton: 'N',
    action: '',
  },
  CMD_DELETE: {
    name: () => {
      return i18n.t('buttons.delete')
    },
    icon: '',
    defbutton: 'X',
    action: '',
  },
  CMD_REF_DELETE: {
    name: () => {
      return i18n.t('buttons.deleteDetails')
    },
    icon: '',
    defbutton: 'X',
    action: '',
  },
  CMD_SUBMIT: {
    name: () => {
      return i18n.t('buttons.submit')
    },
    icon: '',
    defbutton: 'G',
    action: '',
  },
  CMD_UNSUBMIT: {
    name: () => {
      return i18n.t('buttons.cancelSubmission')
    },
    icon: '',
    defbutton: 'G',
    action: '',
  },
  CMD_REFRESH: {
    name: () => {
      return i18n.t('buttons.refresh')
    },
    icon: '',
    defbutton: 'J',
    action: '',
  },
  CMD_CXTAB: () => {
    return i18n.t('tips.statistics')
  },
  CMD_LISTADD: {
    name: () => {
      return i18n.t('buttons.batchAdd')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_IMPORT: {
    name: () => {
      return i18n.t('buttons.import')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_CANCOPY: {
    name: () => {
      return i18n.t('buttons.copy')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_COPY_PER: {
    name: () => {
      return i18n.t('tips.copyPermission')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_UPDATE_SELECTION: {
    name: () => {
      return i18n.t('messages.modifySelectRow')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_UPDATE_RESULTSET: {
    name: () => {
      return i18n.t('messages.modifyResult')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_CopyBill: {
    name: () => {
      return i18n.t('messages.copyBill')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_PRINT_LIST: () => {
    return i18n.t('buttons.print')
  },
  CMD_PRINT_SELECT: () => {
    return i18n.t('tips.printWithTemplate')
  },
  CMD_EXPORT_LIST: {
    name: () => {
      return i18n.t('buttons.export')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_SMS_LIST: {
    name: () => {
      return i18n.t('tips.shortMessage')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_BATCHMODIFY: {
    name: () => {
      return i18n.t('buttons.batchEdit')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  IFRAME_TITLE: () => {
    return i18n.t('tips.dialog')
  },
  PLS_SELECT_CXTAB: () => {
    return i18n.t('messages.selectSummaryTemplate')
  },
  NO_CXTAB: () => {
    return i18n.t('messages.notDefineSummaryTemplate')
  },
  CAN_NOT_BE_NULL: () => {
    return i18n.t('tips.notEmpty')
  },
  MUST_BE_DATE_TYPE: () => {
    return i18n.t('messages.mustDataType')
  },
  MUST_BE_NUMBER_TYPE: () => {
    return i18n.t('messages.mustDigital')
  },
  PLEASE_SELECT: () => {
    return i18n.t('form.selectPlaceholder')
  },
  PLEASE_SETUP_ASSIGNEE: () => {
    return i18n.t('messages.setAgent')
  },
  SEARCH: () => {
    return i18n.t('buttons.find')
  },
  CONTAINS: () => {
    return i18n.t('tips.contain')
  },
  NOTCONTAINS: () => {
    return i18n.t('actions.exclude')
  },
  CLEAR_CONDITION: () => {
    return i18n.t('messages.clickClearSetting')
  },
  PLEASE_CHECK_SELECTED_LINES: () => {
    return i18n.t('messages.tickToConfirm')
  },
  PLEASE_REFRESH_CXTAB_PAGE: () => {
    return i18n.t('messages.reenterReport')
  },
  NO_DATA: () => {
    return i18n.t('tips.noData')
  },
  CLOSE_DIALOG: () => {
    return i18n.t('buttons.close')
  },
  EXCLUDE_CHOOSED_ROWS: () => {
    return i18n.t('buttons.excludeSelectedRows')
  },
  EXCLUDE_ALL: () => {
    return i18n.t('buttons.excludeAll')
  },
  ADD_CHOOSE_ROWS: () => {
    return i18n.t('buttons.addSelectedRow')
  },
  ADD_ALL: () => {
    return i18n.t('buttons.addAll')
  },
  ALREADY_CHOOSED: () => {
    return i18n.t('tips.hasBeenSelected')
  },
  ALREADY_EXCLUDE: () => {
    return i18n.t('tips.hasBeenExcluded')
  },
  SET_ALREADY_CHOOSED: () => {
    return i18n.t('messages.collectionSelected')
  },
  SET_ALREADY_EXCLUDE: () => {
    return i18n.t('messages.collectionExcluded')
  },
  NOTICE: () => {
    return i18n.t('tips.notify')
  },
  PRIORITY: () => {
    return i18n.t('tips.priority')
  },
  RELEASETIME: () => {
    return i18n.t('tips.sendTime')
  },
  SERIALNO: () => {
    return i18n.t('tips.serialNumber')
  },
  TITLE: () => {
    return i18n.t('tips.title')
  },
  URGENT_MESSAGE: () => {
    return '你有$$条紧急消息必需马上处理'
  },
  CONFIRM_MESSAGE: ()=> {
    return '共有$$条需要确认'
  },
  ALL_NOTICES: () => {
    return i18n.t('tips.allNotifications')
  },
  CMD_VOID: {
    name: () => {
      return i18n.t('buttons.invalid')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  CMD_UNVOID: {
    name: () => {
      return i18n.t('tips.cancelVoid')
    },
    icon: '',
    defbutton: null,
    action: '',
  },
  DO_YOU_CONFIRM_VOID: () => {
    return i18n.t('messages.confirmVoidBill')
  },
  DO_YOU_CONFIRM_UNVOID: () => {
    return i18n.t('messages.confirmCancelVoidBill')
  },
}

// 为了保证切换语言包后拿到正确值，此处直接通过劫持属性获取函数返回值。避免再去引用文件中修改变量的使用方法
const buttonmapProxy = {}
Object.keys(buttonmap).forEach((key) => {
  if (typeof buttonmap[key] !== 'object') {
    buttonmapProxy[key] = buttonmap[key]
    Object.defineProperty(buttonmapProxy, key, {
      get() {
        return buttonmap[key]
      },
    })
  } else {
    buttonmapProxy[key] = { ...buttonmap[key] }
    Object.defineProperty(buttonmapProxy[key], 'name', {
      get() {
        return buttonmap[key].name()
      },
    })
  }
})

export default buttonmapProxy
