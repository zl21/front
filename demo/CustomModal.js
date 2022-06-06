
/*
props.contentHtml  弹窗提示内容
props.showType    弹窗提示类型
  
*/ 
const { CustomModal } = window.R3.utils;

class CustomModalNew extends CustomModal{
    constructor( props,response) {
        super( props,response); 
        // this.props.mask = false
        console.log(props,'======1212');
    }
    setContent(html) {
        return `<div style="max-height: 100px; max-width: 300px; overflow: auto;">哈哈，方法测试=========${html}</div>`
    }
  
}
export default CustomModalNew