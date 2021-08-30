// 国际化
import VueI18n from 'vue-i18n'
import en from '../../../../static/js/ark/locale/en-US'
import zh from '../../../../static/js/ark/locale/zh-CN'
import network, { urlSearchParams } from '../../../__utils__/network'
Vue.use(VueI18n)

const locale = $Bcl.locale
const lang = localStorage.getItem('r3-lang') || 'en' // 获取本地缓存语言。用于刷新界面后保持语言不变


const i18n = new VueI18n({
  locale: lang, // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    zh: require('./zh').default, // 中文语言包
    en: require('./en').default, // 英文语言包
  },
  // silentTranslationWarn: true // 去掉警告
})

// 初始化时设置语言
locale(lang) // 设置业务组件库语言
Vue.use(Ark, { locale: lang === 'en' ? en : zh }) // 设置ark-ui语言

const setLanguages = function(language,options) {
  i18n.locale = language // 设置框架语言
  locale(language) // 设置业务组件库语言
   // {Aik,R3,Bcl} from options  用来替换或者是扩展语言
  if(options && options.R3){
    i18n.setLocaleMessage(language,options.R3)
  }
  Vue.use(Ark, { locale: language === 'en' ? en : zh }) // 设置ark-ui语言
  localStorage.setItem('r3-lang', language)
}

window.R3I18n = function(language = 'zh', options) {
  console.log('设置语言环境', language)
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
          setLanguages(language)
        }
      })
  } else {
    setLanguages(language,options)
  }
}

export default i18n
