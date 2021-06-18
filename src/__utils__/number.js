// 将字符串类型的数字转为字符串
export function toThousands(numberStr) {
  var reg = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
  var result = numberStr.replace(reg, "$1,");
  return result;
}