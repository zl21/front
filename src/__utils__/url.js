import {
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX,
  LINK_MODULE_PREFIX,
  enableKeepAlive
} from '../constants/global';

const getUrl = (value) => {
  let path = '';
  if (value.type === 'customized') { 
    if (value.url.indexOf('?') !== -1) { 
      const paramIndex = value.url.lastIndexOf('?');
      path = `/${value.url.slice(0, paramIndex).toUpperCase()}/${value.id}${value.url.slice(paramIndex)}`;
    } else {
      path = `/${value.url.toUpperCase()}/${value.id}`;
    } 
  }
  return path;
};

const getLabel = (value) => {
  let label = '';
  if (value.type === 'customized') {
    const index = value.url.lastIndexOf('/');
    const actionType = value.url.substring(0, value.url.indexOf('/'));
    const itemId = value.url.substring(value.url.lastIndexOf('/') + 1, value.url.length);// 动态id标记，：itemId
    let customizedModuleName = '';
    if (value.url.indexOf('?') !== -1) { // 自定义界面配置携带参数
      const itemId = value.url.substring(value.url.lastIndexOf('/') + 1, value.url.lastIndexOf('?'));// 动态id标记，：itemId
      if (itemId === ':itemId') {
        customizedModuleName = value.url.split('/')[1];
      } else {
        const paramIndex = value.url.lastIndexOf('?');
        customizedModuleName = value.url.substring(index + 1, paramIndex);
      }
    } else if (itemId) { // 配置动态id的情况
      customizedModuleName = value.url.split('/')[1];
    } else {
      customizedModuleName = value.url.substring(index + 1, value.url.length);
    }
    label = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName.toUpperCase()}.${value.id}`;
  }
  return label;
};
export { getUrl, getLabel };
