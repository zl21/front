// 国际化
import VueI18n from 'vue-i18n'
import { locale } from '@syman/ark-ui-bcl/src/utils/i18n'
// import { locale } from '../../../../static/js/ark-ui-bcl/src/utils/i18n/index'
// import en from '@syman/ark-ui/dist/locale/en-US';
// import zh from '@syman/ark-ui/dist/locale/zh-CN';

import en from '../../../../static/js/ark/locale/en-US';
import zh from '../../../../static/js/ark/locale/zh-CN';

import network, { urlSearchParams } from '../../../__utils__/network';

Vue.use(VueI18n) ;

const lang = localStorage.getItem('r3-lang') || 'en'

const i18n = new VueI18n({
    locale: lang,    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
    messages: {
      'zh': require('./zh').default,   // 中文语言包
      'en': require('./en').default    // 英文语言包
    },
    // silentTranslationWarn: true // 去掉警告
})

Vue.use(Ark, { locale: lang === 'en' ? en : zh })  // 设置ark-ui语言

window.R3I18n = function (language = 'zh') {
  console.log('设置语言环境', language)
  const serviceId = window.localStorage.getItem('serviceId')
  const url = serviceId ? `/${serviceId}/p/cs/langswitcher`: '/p/cs/langswitcher'
  network.post(url, urlSearchParams({language}),{noServiceId: true}).then(res => {
    if (res.data.code === 0) {
      i18n.locale = language
      locale(language) // 设置业务组件库语言
      Vue.use(Ark, { locale: language === 'en' ? en : zh }) // 设置ark-ui语言
      localStorage.setItem('r3-lang', language)
    }
  })
  // i18n.locale = language
  // locale(language) // 设置业务组件库语言
  // localStorage.setItem('r3-lang', language)
}


export default i18n
