// 鼠标按下
function keyDownHandler(e, binding, inputElement) {
    const { value } = binding;
    if(!value) {
        return
    }

    // 禁用单引号
    // mac系统貌似无法识别中文单引号
    if(value.toString() === "/'/") {
        // window上按中文单引号会额外触发37,39(即arrowLeft, arrowRight)，导致一些奇怪的行为
        const stopArrowKey = inputElement.__lastCode__ === 'Quote' && (e.keyCode === 37 || e.keyCode === 39)
        if(e.code === 'Quote' || stopArrowKey) {
            e.stopPropagation();
            e.preventDefault();
        }
        inputElement.__lastCode__ = e.code
        return
    }

    const reg = new RegExp(value)
    if (reg.test(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        return;
    }
}

function compositionstartHandler(e, binding) {

}

function compositionendHandler(e, binding) {
    const { value } = binding;
    if(!value) {
        return
    }
    // 禁用单引号
    // 防止输入中文是按单引号，再按shift，导致Input拿到单引号
    if(value.toString() === "/'/") {
        e.target.value = e.target.value.replace(/'/g, '')
        return
    }
}

// 根据正则表单式阻止输入一些字符
// 用法v-disable-input-char="/'/"
export default {
    bind(el, binding) {
        let inputElement = el;
        // 如果节点本身不是input，则认为节点里面只包含一个input，并找出它
        if (el.tagName !== "INPUT") {
            inputElement = el.querySelector("input");
        }

        // 缓存事件
        el.__vueDisableInputChar__ = function(e) {
            keyDownHandler(e, binding, inputElement)
        }
        el.__vueCompositionstart__ = function(e) {
            compositionstartHandler(e, binding)
        }
        el.__vueCompositionend__ = function(e) {
            compositionendHandler(e, binding)
        }
        inputElement.addEventListener('keydown', el.__vueDisableInputChar__)
        inputElement.addEventListener('compositionstart', el.__vueCompositionstart__)
        inputElement.addEventListener('compositionend', el.__vueCompositionend__)
    },

    unbind(el) {
        let inputElement = el;
        // 如果节点本身不是input，则认为节点里面只包含一个input，并找出它
        if (el.tagName !== "INPUT") {
            inputElement = el.querySelector("input");
        }
        inputElement.removeEventListener('keydown', el.__vueDisableInputChar__)
        inputElement.removeEventListener('compositionstart', el.__vueCompositionstart__)
        inputElement.removeEventListener('compositionend', el.__vueCompositionend__)
    }
};
