/**
 * 该文件写js常用操作
 */
// 防抖
function debounce(func, delay = 200) {
  let inDebounce
  return function(...arg) {
    const context = this
    const args = arg
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

// 是否是IE浏览器
function isIE() {
  return window.navigator.userAgent.indexOf('MSIE') >= 1
}

// 是否是函数
function isFunction(param) {
  return typeof param === 'function'
}

export { debounce, isIE, isFunction }
