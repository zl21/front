import router from '../__config__/router.config';
import {
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_COMMONTABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  PLUGIN_MODULE_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  STANDARD_COMMONTABLE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_COMPONENT_PREFIX,
  PLUGIN_MODULE_COMPONENT_PREFIX
} from '../constants/global';

export default ({ route } = {}) => {
  const symbol = '.';
  const { meta, params } = route || router.currentRoute;
  const { routePrefix } = meta;
  const {
    tableName, tableId, itemId, customizedModuleName, customizedModuleId, pluginModuleName 
  } = params;
  let keepAliveModuleName = '';
  const paramItemId = Number(itemId) === -1 ? 'New' : `${itemId}`;
  switch (routePrefix) {
    // Condition One: 路由到标准列表界面名称
    case STANDARD_TABLE_LIST_PREFIX:
      keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}${symbol}${tableName}${symbol}${tableId}`;
      break;
    // Condition One: 路由到标准列表界面名称(普通表格)
    case STANDARD_COMMONTABLE_LIST_PREFIX:
      keepAliveModuleName = `${STANDARD_COMMONTABLE_COMPONENT_PREFIX}${symbol}${tableName}${symbol}${tableId}`;
      break;
    // Condition Two: 路由到纵向布局(上下结构单对象界面)的列表明细界面名称
    case VERTICAL_TABLE_DETAIL_PREFIX:
      keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}${symbol}${tableName}${symbol}${tableId}${symbol}${paramItemId}`;
      break;

    // Condition Three: 路由到横向布局(左右结构单对象界面)的列表明细界面名称
    case HORIZONTAL_TABLE_DETAIL_PREFIX:
      keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}${symbol}${tableName}${symbol}${tableId}${symbol}${paramItemId}`;
      break;

    // Condition Four: 路由到用户自定义界面
    case CUSTOMIZED_MODULE_PREFIX:
      keepAliveModuleName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}${symbol}${customizedModuleName}${symbol}${customizedModuleId}`;
      break;

    // Condition Five: 路由到插件界面
    case PLUGIN_MODULE_PREFIX:
      keepAliveModuleName = `${PLUGIN_MODULE_COMPONENT_PREFIX}${symbol}${pluginModuleName}`;
      break;

    default:
      break;
  }
  return keepAliveModuleName;
};
