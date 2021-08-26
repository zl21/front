// 国际化
import VueI18n from 'vue-i18n'
import { locale as arkLocale } from '@syman/ark-ui';
// import en from '@syman/ark-ui/dist/locale/en-US';
// import zh from '@syman/ark-ui/dist/locale/zh-CN';


import en from '../../../../../js/ark/locale/en-US';
import zh from '../../../../../js/ark/locale/zh-CN';

const lang = localStorage.getItem('ark-ui-bcl-lang') || 'zh'
Vue.use(Ark, { locale: lang === 'en' ? en : zh })  // 设置ark-ui语言

const i18n = new VueI18n({
    locale: lang,    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
    messages: {
      'zh': require('./zh').default,   // 中文语言包
      'en': require('./en').default    // 英文语言包
    }
})

// 挂全局方便测试用
window.ArkUiBclI18n = function (language) {
  i18n.locale = language
  Vue.use(Ark, { locale: language === 'en' ? en : zh }) // 设置ark-ui语言
  localStorage.setItem('ark-ui-bcl-lang', language)
}

export const locale = ArkUiBclI18n // 暴露接口给引用方使用

export default i18n
