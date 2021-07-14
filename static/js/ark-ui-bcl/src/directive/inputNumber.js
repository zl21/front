function inputNumber(el, binding) {
  let inputElement = el;
  if (el.tagName !== 'INPUT') {
    inputElement = el.querySelector('input');
  }
  
  if (binding.arg && binding.arg === 'NUMBER') {
    inputElement.onkeypress = function press(e) {
      e = e || window.event;
      const charCode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;

      const re = /\d/;
      const whiteList = [];
      // 允许逗号
      if (binding.modifiers.comma) {
        whiteList.push(44);
      }
      // 允许小数
      if (binding.modifiers.decimal) {
        whiteList.push(46);
      }
      if (!re.test(String.fromCharCode(charCode)) && charCode > 9 && !e.ctrlKey && !whiteList.includes(charCode)) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    };
  } else {
    inputElement.onkeypress = function press() {};
  }
}

// function inputNumber(Vue) {
//   Vue.directive('inputNumber', {
//     inserted(el, binding) {
//       inputControl(el, binding);
//     },

//     update(el, binding) {
//       inputControl(el, binding);
//     },
//   });
// }

export default inputNumber;
