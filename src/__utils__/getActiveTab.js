import {
  STANDARD_TABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  PLUGIN_MODULE_PREFIX,
  LINK_MODULE_PREFIX 
} from '../constants/global';
import store from '../__config__/store.config';

// const { keepAliveLabelMaps } = store.state.global;


export default (path) => {
  // path:/CUSTOMIZED/FUNCTIONPERMISSION/2097
  let getActiveTab = {};
  let type = '';
  let keepAliveModuleNames = '';
  let tableNameRes = '';
  let routePrefix = '';
  if (path) {
    if (path.includes(STANDARD_TABLE_LIST_PREFIX)) { // 列表
  
    } else if (path.includes(HORIZONTAL_TABLE_DETAIL_PREFIX)) { // 单对象左右结构
  
    } else if (path.includes(VERTICAL_TABLE_DETAIL_PREFIX)) { // 单对象上下结构
  
    } else if (path.includes(CUSTOMIZED_MODULE_PREFIX)) { // 自定义类型
      type = path.split('/')[1];
      keepAliveModuleNames = path.replace(/\//g, '.').replace('.', '').replace(type, 'C');
      tableNameRes = path.split('/')[2];
      routePrefix = `/${path.split('/')[1]}`; 
    } else if (path.includes(PLUGIN_MODULE_PREFIX)) { // 插件类型
  
    } else if (path.includes(LINK_MODULE_PREFIX)) { // 外链类型
  
    }
  }
 
  getActiveTab = {
    isActive: true,
    label: store.state.global.keepAliveLabelMaps[keepAliveModuleNames],
    keepAliveModuleName: keepAliveModuleNames,
    tableName: tableNameRes,
    routeFullPath: path,
    routePrefix
  };
  return getActiveTab;
};
