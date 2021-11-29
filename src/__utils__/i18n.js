import i18n from "../assets/js/i18n";
import en from '../../static/js/ark/dist/locale/en-US.js'
import zh from '../../static/js/ark/dist/locale/zh-CN.js'
import network, { urlSearchParams } from '../__utils__/network'

const locale = $Bcl.locale
const BCL_mergeLocaleMessage = $Bcl.BCL_mergeLocaleMessage
const BCL_setLocaleMessage = $Bcl.BCL_setLocaleMessage

// 扩展语言
window.R3_mergeLocaleMessage = function(language, options) {
  // {R3,Bcl} from options  用来替换或者是扩展语言
  // 扩展r3语言
  if (options && options.R3) {
    i18n.mergeLocaleMessage(language, options.R3)
  }
  // 扩展业务组件库语言
  if (options && options.BCL) {
    BCL_mergeLocaleMessage(language, options.BCL)
  }
}

// 新增语言
window.R3_setLocaleMessage = function(language, options) {
  // {R3,Bcl} from options  用来替换或者是扩展语言
  // 扩展r3语言
  if (options && options.R3) {
    i18n.setLocaleMessage(language, options.R3)
  }
  // 扩展业务组件库语言
  if (options && options.BCL) {
    BCL_setLocaleMessage(language, options.BCL)
  }
}

// 设置语言
const setLanguages = function(language) {
  // 设置框架语言
  i18n.locale = language
  localStorage.setItem('r3-lang', language)

  // 设置业务组件库语言
  locale(language)

  // 设置ark-ui语言
  Vue.use(Ark, { locale: language === 'en' ? en : zh })
}

// 挂载语言切换api
window.R3I18n = function(language = 'zh', options) {
  const serviceId = window.localStorage.getItem('serviceId')
  const url = serviceId
    ? `/${serviceId}/p/cs/langswitcher`
    : '/p/cs/langswitcher'

  // 是否请求切换语言接口
  if (options && options.enableApi) {
    return network
      .post(url, urlSearchParams({ language }), { noServiceId: true })
      .then((res) => {
        if (res.data.code === 0) {
          setLanguages(language, options)
        }
      })
  } else {
    setLanguages(language, options)
  }
}

const lang = localStorage.getItem('r3-lang') || 'zh' // 获取本地缓存语言。用于刷新界面后保持语言不变
// 初始化时设置语言
locale(lang) // 设置业务组件库语言
Vue.use(Ark, { locale: lang === 'en' ? en : zh }) // 设置ark-ui语言
