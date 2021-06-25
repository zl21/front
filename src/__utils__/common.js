/**
 * 该文件写js常用操作
 */
// 防抖
export function debounce(func, delay = 200) {
  let inDebounce
  return function(...arg) {
    const context = this
    const args = arg
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

