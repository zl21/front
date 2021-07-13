// 判断是否是一个对象
function isObject(arg) {
  return Object.prototype.toString.call(arg) === '[object Object]';
}

// 判断是否是空对象
function isEmptyObject(arg) {
  if (!isObject(arg)) {
    throw new Error('参数必须是一个对象');
  }
  return Object.keys(arg).length === 0;
}

export {
  isObject,
  isEmptyObject
};
