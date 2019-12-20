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
    let customizedModuleName = '';
    if (value.url.indexOf('?') !== -1) { // 自定义界面配置携带参数
      const paramIndex = value.url.lastIndexOf('?');
      customizedModuleName = value.url.substring(index + 1, paramIndex);
    } else {
      customizedModuleName = value.url.substring(index + 1, value.url.length);
    }
    label = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName.toUpperCase()}.${value.id}`;
  }
  return label;
};
export { getUrl, getLabel };
