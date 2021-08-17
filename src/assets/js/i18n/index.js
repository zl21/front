// 国际化
import VueI18n from 'vue-i18n'
import network, { urlSearchParams } from '../../../__utils__/network';

Vue.use(VueI18n) ;

const i18n = new VueI18n({
    locale: 'zh',    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
    messages: {
      'zh': require('./zh').default,   // 中文语言包
      'en': require('./en').default    // 英文语言包
    }
})

window.R3i18n = function (language) {
  network.post('/p/cs/langswitcher', urlSearchParams({language: lang})).then(res => {
    if (res.data.code === 0) {
      i18n.locale = language
    }
  })
}


export default i18n