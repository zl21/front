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

// 深拷贝
export function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

// 获取getCookie
export function R3getCookie(name) {
  var prefix = name + "="
  var start = document.cookie.indexOf(prefix);
  console.log('============',document.cookie);

  if (start == -1) {
      return null;
  }

  var end = document.cookie.indexOf(";", start + prefix.length)
  if (end == -1) {
      end = document.cookie.length;
  }

  var value = document.cookie.substring(start + prefix.length, end)
  return unescape(value);
}
/*
obj
*/
// 判空处理
export const isEmpty = (obj)=>{
  if(typeof obj ==='object'){
      obj = JSON.stringify(obj || {}).replace(/null|,/g,'');
  }

  if(obj === undefined || obj === "null" || obj === "" || obj === "[]" || obj === "{}"){
      return true;
  }else{
      return false;
  }
 
}

export const copy = function(text){
  const dom = document.createElement('input')
  dom.style.opacity = 0
  dom.style.position = 'fixed'
  dom.style.left='-99999px'
  dom.setAttribute('id', 'r3-copy-input')
  document.body.appendChild(dom)

  dom.value = text
  dom.select()
  document.execCommand('copy') 
  document.body.removeChild(dom)
}