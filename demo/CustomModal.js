import CustomModal from '../src/__utils__/Modal';

/*
props.contentHtml  弹窗提示内容
props.showType    弹窗提示类型
  
*/ 

class CustomModalNew extends CustomModal{
    constructor( props,response) {
        super( props,response); 
        // this.props.mask = false
    }
    setContent(html) {
        return `<div style="max-height: 100px; max-width: 300px; overflow: auto;">哈哈，方法测试${html}</div>`
    }
  
}
export default CustomModalNew