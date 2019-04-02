import router from '../__config__/router.config';
import {
  STANDARD_TABLE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX
} from '../constants/global';


export default () => {
  const routerPath = router.currentRoute.path;
  const routerparams = router.currentRoute.params;
  let keepAliveModuleName = '';
  let { itemId } = routerparams;
  const { tableName, tableId } = routerparams;
  // Condition One: 路由到标准列表界面名称
  if (/\/SYSTEM\/TABLE\//.test(routerPath)) {
    keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  }
  if (itemId === -1) {
    itemId = 'New';
    // Condition Two: 路由到上下结构（纵向布局）的列表明细界面名称
    if (/\/SYSTEM\/TABLE_DETAIL\/V\//.test(routerPath)) {
      keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
    }
  }
  
  // Condition Three: 路由到左右Tab页签切换（横向布局）的列表明细界面名称
  if (/\/SYSTEM\/TABLE_DETAIL\/H\//.test(routerPath)) {
    keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
  }
  // Condition Three: 路由到table类型的列表明细界面名称
  if (/\/SYSTEM\/TABLE_DETAIL\/A\//.test(routerPath)) {
    keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
  }
  return keepAliveModuleName;
};
