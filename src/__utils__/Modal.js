import { copy } from '../__utils__/common'
import i18n from '../assets/js/i18n';

/*
this.item  传参的props
this.props  设置的默认配置
showType:弹窗类型
contentHtml:提示内容

*/
class CustomModal {
    constructor(props,response) {
        this.item = props;
        this.props = {};
        this.response = response;
        this.props.mask = true;
        this.props.titleAlign = 'center';
        this.props.title = i18n.t('feedback.error');
        this.props.footerHide = true;
    }
    init() {
        this.props.content = this.setContent(this.item.contentHtml);
        this.props.footerTemplate = this.setFooter();
        this.props = Object.assign(this.props,this.item);
        window.vm.$Modal.remove();
        return window.vm.$Modal[this.props.showType](this.props);
    }
    
    setContent(html) {
        return `<div style="max-height: 100px; max-width: 300px; overflow: auto;">${html}</div>`
    }
    setFooter() {
        let self = this;
        return {
            template:
               `<div>
                    <Button size="small" type="fcdefault" @click="copy">${i18n.t('buttons.copy')}</Button>
                    <Button size="small" type="posdefault"  @click="close">${i18n.t('buttons.close')}</Button>
                </div>`,
            methods: {
                close() {
                    this.$parent.close();
                },
                copy() {
                    copy(self.item.contentHtml)
                    window.vm.$Message.success(`${i18n.t('buttons.copy')}${i18n.t('feedback.success')}`)
                }
            }
        }

    }
   
}

export default CustomModal;