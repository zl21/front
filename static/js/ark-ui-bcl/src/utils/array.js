// 获取数组符合条件的某一项(对象)key所对应的值
function getValueOfItem(key, array, callback) {
  const item = array.find(callback);
  return item[key];
}

// 判断空数组
function isEmptyArray(array) {
  return array.length === 0;
}

// 是否是数组
function isArray(data) {
  return Object.prototype.toString.call(data) === '[object Array]'
}

export {
  isEmptyArray,
  getValueOfItem,
  isArray
};
