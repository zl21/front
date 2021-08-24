// 国际化
import VueI18n from 'vue-i18n'
import { locale } from '@syman/ark-ui-bcl/src/utils/i18n'
import network, { urlSearchParams } from '../../../__utils__/network';

Vue.use(VueI18n) ;

const lang = localStorage.getItem('r3-lang')

const i18n = new VueI18n({
    locale: lang || 'en',    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
    messages: {
      'zh': require('./zh').default,   // 中文语言包
      'en': require('./en').default    // 英文语言包
    },
    // silentTranslationWarn: true // 去掉警告
})

window.R3I18n = function (language) {
  network.post('/p/cs/langswitcher', urlSearchParams({language: lang})).then(res => {
    if (res.data.code === 0) {
      i18n.locale = language
      locale(language) // 设置业务组件库语言
      localStorage.setItem('r3-lang', language)
    }
  })
  // i18n.locale = language
  // locale(language) // 设置业务组件库语言
  // localStorage.setItem('r3-lang', language)
}


export default i18n