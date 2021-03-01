function inputControl(el, binding) {
  let inputElement = el;
  if (el.tagName !== 'INPUT') {
    inputElement = el.querySelector('input');
  }

  if (binding.arg && binding.arg.toUpperCase().startsWith('NUMBER')) {
    inputElement.onkeypress = function press(e) {
      e = e || window.event;
      const charCode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
      console.log('🚀 ~ file: inputNumber.js ~ line 11 ~ press ~ charCode', charCode);

      const re = /\d/;
      // 44指逗号
      if (!re.test(String.fromCharCode(charCode)) && charCode > 9 && !e.ctrlKey && charCode !== 44) {
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

function inputNumber(Vue) {
  Vue.directive('inputNumber', {
    inserted(el, binding) {
      inputControl(el, binding);
    },

    update(el, binding) {
      inputControl(el, binding);
    },
  });
}

export default inputNumber;
