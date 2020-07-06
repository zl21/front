import project from '../../project.config';
import configForColumn from './extentionPropertyForColumn';
import configForTable from './extentionPropertyForTable';
import backDashboardRoutes from '../__config__/backDashboardRoute.config';
import custommizedRequestURL from '../__config__/custommizedRequestURL.config';


export const functionPowerRequestURL = () => (window.ProjectConfig && window.ProjectConfig.functionPowerRequestURL ? window.ProjectConfig.functionPowerRequestURL : project.functionPowerRequestURL);
export const Version = () => (window.ProjectConfig && window.ProjectConfig.Version ? window.ProjectConfig.Version : project.Version);
export const interlocks = () => (window.ProjectConfig && typeof window.ProjectConfig.interlocks === 'boolean' ? window.ProjectConfig.interlocks : project.interlocks);
export const jflowRequestDomain = () => (window.ProjectConfig && window.ProjectConfig.jflowRequestDomain ? window.ProjectConfig.jflowRequestDomain : project.jflowRequestDomain);
export const enableJflow = () => (window.ProjectConfig && typeof window.ProjectConfig.enableJflow === 'boolean' ? window.ProjectConfig.enableJflow : project.enableJflow);
export const enableCustomInterface = () => (window.ProjectConfig && typeof window.ProjectConfig.enableCustomInterface === 'boolean' ? window.ProjectConfig.enableCustomInterface : project.enableCustomInterface);
export const closeJflowIcon = () => (window.ProjectConfig && typeof window.ProjectConfig.closeJflowIcon === 'boolean' ? window.ProjectConfig.closeJflowIcon : project.closeJflowIcon);
export const encryptionJflow = () => (window.ProjectConfig && typeof window.ProjectConfig.encryptionJflow === 'boolean' ? window.ProjectConfig.encryptionJflow : project.encryptionJflow);
export const enableKeepAlive = () => (window.ProjectConfig && typeof window.ProjectConfig.enableModuleKA === 'boolean' ? window.ProjectConfig.enableModuleKA : project.enableModuleKA);
export const enableInitializationRequest = () => (window.ProjectConfig && typeof window.ProjectConfig.enableInitializationRequest === 'boolean' ? window.ProjectConfig.enableInitializationRequest : project.enableInitializationRequest);
export const specifiedGlobalGateWay = () => (window.ProjectConfig && window.ProjectConfig.specifiedGlobalGateWay ? window.ProjectConfig.specifiedGlobalGateWay : project.specifiedGlobalGateWay);
export const mock = () => (window.ProjectConfig && typeof window.ProjectConfig.mock === 'boolean' ? window.ProjectConfig.mock : project.mock);
export const enableGateWay = () => {
  if (mock()) {
    return false;
  }
  if (window.ProjectConfig && typeof window.ProjectConfig.enableGateWay === 'boolean') {
    return window.ProjectConfig.enableGateWay;
  }
  return project.enableGateWay;
};

export const enableTabLists = () => (window.ProjectConfig && typeof window.ProjectConfig.enableTabLists === 'boolean' ? window.ProjectConfig.enableTabLists : project.enableTabLists);

export const enableHistoryAndFavoriteUI = () => (window.ProjectConfig && typeof window.ProjectConfig.enableHistoryAndFavoriteUI === 'boolean' ? window.ProjectConfig.enableHistoryAndFavoriteUI : project.enableHistoryAndFavoriteUI);

export const enableHistoryAndFavorite = () => (window.ProjectConfig && typeof window.ProjectConfig.enableHistoryAndFavorite === 'boolean' ? window.ProjectConfig.enableHistoryAndFavorite : project.enableHistoryAndFavorite);
export const getTouristRoute = () => (window.ProjectConfig && window.ProjectConfig.touristRoute ? window.ProjectConfig.touristRoute : project.touristRoute);
export const getCustomizeWaterMark = () => (window.ProjectConfig && window.ProjectConfig.customizeWaterMark ? window.ProjectConfig.customizeWaterMark : project.customizeWaterMark);
export const encryptedPassword = () => (window.ProjectConfig && window.ProjectConfig.encryptedPassword ? window.ProjectConfig.encryptedPassword : project.encryptedPassword);
export const isItemTableNewValidation = () => (window.ProjectConfig && typeof window.ProjectConfig.isItemTableNewValidation === 'boolean' ? window.ProjectConfig.isItemTableNewValidation : project.isItemTableNewValidation);
export const isCommonTable = () => (window.ProjectConfig && typeof window.ProjectConfig.isCommonTable === 'boolean' ? window.ProjectConfig.isCommonTable : project.isCommonTable);
export const custommizedJflow = () => (window.ProjectConfig && typeof window.ProjectConfig.custommizedJflow === 'boolean' ? window.ProjectConfig.custommizedJflow : project.custommizedJflow);
export const cbs = () => (window.ProjectConfig && window.ProjectConfig.cbs ? window.ProjectConfig.cbs : project.cbs || {});
export const layoutDirection = () => ((window.ProjectConfig && typeof window.ProjectConfig.layoutDirection === 'boolean' ? window.ProjectConfig.layoutDirection : project.layoutDirection) || false);
export const contentConfig = () => (window.ProjectConfig && window.ProjectConfig.contentConfig ? window.ProjectConfig.contentConfig : project.contentConfig);

export const STANDARD_TABLE_LIST_PREFIX = '/SYSTEM/TABLE';
export const STANDARD_COMMONTABLE_LIST_PREFIX = '/SYSTEM/COMMONTABLE';
export const HORIZONTAL_TABLE_DETAIL_PREFIX = '/SYSTEM/TABLE_DETAIL/H';
export const VERTICAL_TABLE_DETAIL_PREFIX = '/SYSTEM/TABLE_DETAIL/V';
export const CUSTOMIZED_MODULE_PREFIX = '/CUSTOMIZED';
export const PLUGIN_MODULE_PREFIX = '/PLUGIN';
export const LINK_MODULE_PREFIX = '/LINK';

export const STANDARD_TABLE_COMPONENT_PREFIX = 'S';
export const STANDARD_COMMONTABLE_COMPONENT_PREFIX = 'SC';
export const HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX = 'H';
export const VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX = 'V';
export const CUSTOMIZED_MODULE_COMPONENT_PREFIX = 'C';
export const PLUGIN_MODULE_COMPONENT_PREFIX = 'P';
export const LINK_MODULE_COMPONENT_PREFIX = 'L';

export const REQUEST_PENDDING_EXPIRE = 1000 * 10;
export const KEEP_MODULE_STATE_WHEN_CLICK_MENU = true; // 控制点击按钮菜单时如何显示已经打开的模块
export const KEEP_SAVE_ITEM_TABLE_MANDATORY = false;// 控制当子表没有必填项点击保存时是否必须填写子表信息
export const INSTANCE_ROUTE = 'instanceRoute';
export const INSTANCE_ROUTE_QUERY = 'instanceRouteQuery';
export const MODULE_COMPONENT_NAME = 'moduleComponentName';
export const DB_NAME = 'R3';
export const DB_SCHEMA_NETWORK = 'Network';
export const ENABLE_NETWORK_MONITOR = () => (window.ProjectConfig && typeof window.ProjectConfig.enableNetworkMonitor === 'boolean' ? window.ProjectConfig.enableNetworkMonitor : project.enableNetworkMonitor);
export const SLOW_NETWORK_THRESHOLD = 0;
export const HAS_BEEN_DESTROYED_MODULE = 'destroyedModule';
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
  '/p/c/get_service_id',
  '/api/rpt/print/query',
  '/api/rpt/userprint/save',
];

// 不走网关的正则模式匹配
export const ignorePattern = () => {
  const { ignoreGateWayPattern } = window.ProjectConfig || {};
  return (project.ignoreGateWayPattern || []).concat(ignoreGateWayPattern || []);
};

// 静默路由，当遇到网络请求403时，不跳转到登录页。
export const defaultQuietRoutes = [
  '/login',
  '/PLUGIN/PRINTTEMPLATE',
  '/PLUGIN/PRINTPREVIEW'
];

// 导出表的拓展属性、字段扩展属性配置。

export const extentionForColumn = () => (window.ProjectConfig && window.ProjectConfig.extentionForColumn ? window.ProjectConfig.extentionForColumn : configForColumn);


// 导出表的拓展属性、字段扩展属性配置。
export const extentionForTable = () => (window.ProjectConfig && window.ProjectConfig.extentionForTable ? window.ProjectConfig.extentionForTable : configForTable);

// 配置路由刷新浏览器回到dashboard界面
export const backDashboardRoute = () => (window.ProjectConfig && window.ProjectConfig.backDashboardRoute ? window.ProjectConfig.backDashboardRoute.concat(backDashboardRoutes) : backDashboardRoutes);
// 配置内置自定义界面requestURL
export const custommizedRequestUrl = () => (window.ProjectConfig && window.ProjectConfig.custommizedRequestURL ? window.ProjectConfig.custommizedRequestURL : custommizedRequestURL);
