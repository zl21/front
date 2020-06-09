import store from '../__config__/store.config';

const serilizeUrl = (url) => {
  const urlObject = {};
  if (/\?/.test(url)) {
    const urlString = url.substring(url.indexOf('?') + 1); 
    const urlArray = urlString.split('&');
    for (let i = 0, len = urlArray.length; i < len; i++) {
      const urlItem = urlArray[i];
      const item = urlItem.split('=');
      urlObject[item[0]] = item[1]; 
    }
    return urlObject;
  }
  return null; 
};
 
const getUserenv = (param) => {
  // 参数说明
  // param:{
  //   url:路由，
  //   customizedModuleId：自定义界面ID，
  //   label：定义的自定义界面label
  // }
  if (store.state.global.userInfo && store.state.global.userInfo.userenv) {
    const userenv = store.state.global.userInfo.userenv;
    if (param.url && param.url.includes('?')) { // 如果当前url配置参数,将参数部分截取
      const query = serilizeUrl(param.url);
      if (Object.keys(query) && Object.keys(query).length > 0 && Object.keys(userenv) && Object.keys(userenv).length > 0) {
        Object.keys(query).map((q) => {
          Object.keys(userenv).map((u) => {
            if (u.includes(q)) {
              param.url = param.url.replace(`{${q}}`, `{${userenv[u]}}`);
            }
          });
        });
      }
    }
  }
  return param.url;
};
export default getUserenv;
