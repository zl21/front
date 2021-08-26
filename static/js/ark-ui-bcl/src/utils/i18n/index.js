// 国际化
import VueI18n from 'vue-i18n'
const zh = require('./zh').default
const en = require('./en').default 

const lang = localStorage.getItem('ark-ui-bcl-lang') || 'zh'

const i18n = new VueI18n({
    locale: lang,    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
    messages: {
      zh,   // 中文语言包
      en    // 英文语言包
    }
})

// 挂全局方便测试用
window.ArkUiBclI18n = function (language) {
  i18n.locale = language
  localStorage.setItem('ark-ui-bcl-lang', language)
}

export const locale = ArkUiBclI18n // 暴露接口给引用方使用

export default i18n