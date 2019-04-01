export const enableGateWay = true;

// 需要走全局公共网关的接口
export const globalGateWay = [
  '/p/cs/getSubSystems',
  '/p/cs/hello',
  '/p/cs/getHistoryAndFavorite',
  '/p/cs/getParamList',
  '/p/cs/setUserParam',
  '/p/c/login',
  '/p/cs/logout',
  '/p/cs/removeFromFavorite',
  '/p/cs/addToFavorite',
  '/p/cs/getUserConfig',
  '/p/cs/setColPosition',
  '/p/cs/recHistory',
  '/p/cs/setHideColumn',
  '/p/c/getCaptcha',
  '/p/cs/getTableQuery',
  '/p/cs/QueryList',
  '/p/cs/test/accept', // 验收接口
  '/p/cs/objectTab',
  '/p/cs/getObject',
  '/p/cs/objectTableItem',
  '/p/cs/inputForitem',
  '/p/cs/itemObj'
];

// 不走网关的接口
export const ignoreGateWay = [
  '/p/c/get_service_id',
];
