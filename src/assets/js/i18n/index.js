// 国际化
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'

if (!('$i18n' in Vue.prototype)) {
  Vue.use(VueI18n)
}

// 挂载r3语言包
if (!window.R3_lang) {
  window.R3_lang = {
    zh, // 中文语言包
    en, // 英文语言包
  }
}

const lang = localStorage.getItem('r3-lang') || 'zh' // 获取本地缓存语言。用于刷新界面后保持语言不变
const i18n = new VueI18n({
  locale: lang, // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    zh, // 中文语言包
    en, // 英文语言包
  },
  // silentTranslationWarn: true // 去掉警告
})



export default i18n
