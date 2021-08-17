/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-09-13 15:30:31
 * @version $Id$
 */
import i18n from './i18n'

const ChineseDictionary = {
  ONLYREADY: () => {
    return `【${i18n.t('messages.switchReadOnlyInterface')}】`
  },
  REFRESH: () => {
    return i18n.t('buttons.refresh')
  },
  RESETSEARCH: () => {
    return `【${i18n.t('buttons.reset')}】`
  },
  PLEASEENTER: () => {
    return ''
  }, // 请输入
  PLEASESELECT: () => {
    return ''
  }, // 请选择
  MORE: () => {
    return i18n.t('tips.more')
  },
  HIDDENCOLUMNS: () => {
    return i18n.t('tips.hiddenColumn')
  },
  SCREEN: () => {
    return i18n.t('buttons.filter')
  },
  RESET: () => {
    return i18n.t('buttons.reset')
  },
  SERIALNUMBER: () => {
    return i18n.t('table.index')
  },
  NODATADISPLAY: () => {
    return i18n.t('tips.noData')
  },
  TOTAL: () => {
    return i18n.t('table.summation')
  },
  AMOUNT: () => {
    return i18n.t('table.total')
  },
  PROMPT: () => {
    return i18n.t('feedback.alert')
  },
  CANCEL: () => {
    return i18n.t('buttons.cancel')
  },
  CONFIRM: () => {
    return i18n.t('buttons.confirm')
  },
  CLOSE: () => {
    return i18n.t('buttons.close')
  },
  ENSURE: () => {
    return i18n.t('buttons.confirm')
  },
  COLLECTIONOFSUCCESS: () => {
    return i18n.t('feedback.collectionSuccess')
  },
  COLLECTIONOFFAILED: () => {
    return i18n.t('feedback.collectionFailed')
  },
  UNCOLLECTIBLE: () => {
    return i18n.t('feedback.unfavoriteSuccessfully')
  },
  CANCELCOLLECTIONFAILED: () => {
    return i18n.t('feedback.failedToUnfavorite')
  },
  MODIFY: () => {
    return i18n.t('buttons.modify')
  },
  ALL: () => {
    return i18n.t('tips.all')
  },
  '@no-permission@': () => {
    return i18n.t('messages.noPermissionToAccess')
  },
  NODATA: () => {
    return i18n.t('tips.noData')
  },
  QUERYCRITERIA: () => {
    return i18n.t('tips.queryCondition')
  },
  NUMBER: () => {
    return i18n.t('table.index')
  },
  IMPORT: () => {
    return i18n.t('buttons.import')
  },
  EXPORT: () => {
    return i18n.t('buttons.export')
  },
  MORESCREENING: () => {
    return i18n.t('messages.moreFilters')
  },
  QUERYCONDITION: () => {
    return i18n.t('tips.queryCondition')
  },
  SCREENCONDITION: () => {
    return i18n.t('tips.filterCondition')
  },
  SEARCH: () => {
    return i18n.t('buttons.find')
  },
  ADDTHECONDITION: () => {
    return i18n.t('messages.addCondition')
  },
  HASBEENSELECTED: () => {
    return i18n.t('feedback.selected')
  },
  SELECTEDRESULTS: () => {
    return i18n.t('tips.filterResults')
  },
  VIEWTHESELECTEDRESULTS: () => {
    return i18n.t('messages.viewSelectedResults')
  },
  PLEASEINPUTAGAIN: () => {
    return i18n.t('messages.pleaseEnterAgain')
  },
  GLOBALSEARCH: () => {
    return i18n.t('actions.globalSearch')
  },
  EXCLUDE: () => {
    return i18n.t('actions.exclude')
  },
  BACK: () => {
    return i18n.t('buttons.back')
  },
  IMPORTTITLE: () => {
    return i18n.t('messages.uploadWarning')
  },
  DOWNTEMPLATE: () => {
    return `(${i18n.t('messages.downloadTemplateRemark')})`
  },
  SELECTFILE: () => {
    return i18n.t('buttons.selectFile')
  },
  FILEMAX: () => {
    return i18n.t('messages.fileSizeTip')
  },
  ERROR: () => {
    return i18n.t('feedback.error')
  },
  WARNING: () => {
    return i18n.t('feedback.warning')
  },
  COLOURSIZESAVE: () => {
    return i18n.t('messages.colorSizeSave')
  },
  COLOUR: () => {
    return i18n.t('tips.color')
  },
  SIZE: () => {
    return i18n.t('tips.size')
  },
  SUBMIT: () => {
    return i18n.t('buttons.submit')
  },
  PAGENAME: () => {
    return i18n.t('tips.templateName')
  },
  POTX: () => {
    return i18n.t('messages.saveAsTemplate')
  },
  SOURCETABLENAME: () => {
    return i18n.t('tips.sourceTable')
  },
  TARGETTABLENVARCHAR: () => {
    return i18n.t('tips.targetTable')
  },
  TARGETDESCRIPTION: () => {
    return i18n.t('tips.targetDescription')
  },
  OriginalStoreWarehouse: () => {
    return i18n.t('messages.originalWarehouse')
  },
  TargetStoreWarehouse: () => {
    return i18n.t('messages.targetWarehouse')
  },
  VIPSTYLE: () => {
    return i18n.t('messages.VIPType')
  },
  EMPTY: () => {
    return i18n.t('actions.clear')
  },
  MATCH: () => {
    return i18n.t('actions.match')
  },
}

// 为了保证切换语言包后拿到正确值，此处直接通过劫持属性获取函数返回值。避免再去引用文件中修改变量的使用方法
const ChineseDictionaryProxy = {}
Object.keys(ChineseDictionary).forEach((key) => {
  ChineseDictionaryProxy[key] = ''
  Object.defineProperty(ChineseDictionaryProxy, key, {
    get() {
      return ChineseDictionary[key]()
    },
  })
})

export default ChineseDictionaryProxy
