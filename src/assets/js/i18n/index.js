// 国际化
import VueI18n from 'vue-i18n'

Vue.use(VueI18n) ;

const i18n = new VueI18n({
    locale: window.ProjectConfig.lang || 'zh',    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
    messages: {
      'zh': require('./zh').default,   // 中文语言包
      'en': require('./en').default    // 英文语言包
    }
})

export default i18n