import router from '../__config__/router.config';
import {
  STANDARD_TABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX,
} from '../constants/global';


export default () => {
  const { meta, params } = router.currentRoute;
  const { routePrefix } = meta;
  const { tableName, tableId, itemId } = params;
  let keepAliveModuleName = '';
  const paramItemId = Number(itemId) === -1 ? 'New' : `${itemId}`;
  switch (routePrefix) {
    // Condition One: 路由到标准列表界面名称
    case STANDARD_TABLE_LIST_PREFIX:
      keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      break;

    // Condition Three: 路由到左右Tab页签切换（横向布局）的列表明细界面名称
    case VERTICAL_TABLE_DETAIL_PREFIX:
      keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${paramItemId}`;
      break;

    // Condition Three: 路由到table类型的列表明细界面名称
    case HORIZONTAL_TABLE_DETAIL_PREFIX:
      keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${paramItemId}`;
      break;

    default:
      break;
  }
  return keepAliveModuleName;
};
