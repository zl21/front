import project from '../../project.config';

const ProjectConfig = window.ProjectConfig;
export const Version = () => ProjectConfig.Version || project.Version;


export const interlocks = ProjectConfig.interlocks;
export const enableGateWay = () => ProjectConfig.enableGateWay || project.enableGateWay;

export const STANDARD_TABLE_LIST_PREFIX = '/SYSTEM/TABLE';
export const HORIZONTAL_TABLE_DETAIL_PREFIX = '/SYSTEM/TABLE_DETAIL/H';
export const VERTICAL_TABLE_DETAIL_PREFIX = '/SYSTEM/TABLE_DETAIL/V';
export const CUSTOMIZED_MODULE_PREFIX = '/CUSTOMIZED';

export const STANDARD_TABLE_COMPONENT_PREFIX = 'S';
export const HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX = 'H';
export const VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX = 'V';
export const CUSTOMIZED_MODULE_COMPONENT_PREFIX = 'C';


export const KEEP_MODULE_STATE_WHEN_CLICK_MENU = true; // 控制点击按钮菜单时如何显示已经打开的模块
export const KEEP_SAVE_ITEM_TABLE_MANDATORY = false;// 控制当子表没有必填项点击保存时是否必须填写子表信息


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
  '/p/cs/changechruserpwd',
  '/p/cs/SearchWords'
];

// 不走网关的接口
export const ignoreGateWay = [
  '/p/c/get_service_id'
];

//
export const defaultQuietRoutes = [
  '/login'
];
