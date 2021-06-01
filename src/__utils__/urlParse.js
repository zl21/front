/**
 * 解析url参数
 * @example  ?id=1&table=pro
 * @return Object {id:1,table:pro}
 * */
export default function urlParse(path) {
  const url = path || window.location.search;// 得到url问号后面拼接的参数  ?id=12345&a=b
  const obj = {};// 创建一个Object
  const reg = /[?&][^?&]+=[^?&]+/g;// 正则匹配 ?&开始 =拼接  非?&结束  的参数
  const arr = url.match(reg);// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
  // arr数组形式 ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      /**
       * tempArr数组    ['id','12345']和['a','b']
       * 第一个是key，第二个是value
       * */
      const tempArr = item.substring(1).split('=');
      const key = decodeURIComponent(tempArr[0]);
      const val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

// 获取url里的表明
export function getTableName() {
  const path = window.location.pathname
  const arr = path.split('/')
  let tableName = ''
  for(let i = arr.length - 1; i >= 0; i--) {
    const str = arr[i]
    const isNumber = /(^[1-9]\d*$)/.test(str)
    const isNew = /^New$/.test(str) // 新增界面的id标识,即New
    if(!isNumber && !isNew) {
      tableName = str
      break
    }
  }
  return tableName
}