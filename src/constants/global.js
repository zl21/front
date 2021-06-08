/* eslint-disable no-nested-ternary */
import project from '../../project.config';
import configForColumn from './extentionPropertyForColumn';
import configForTable from './extentionPropertyForTable';
import backDashboardRoutes from '../__config__/backDashboardRoute.config';
import custommizedRequestURL from '../__config__/custommizedRequestURL.config';
import connectorConfig from './connector';
import navMenuConfig from '../__config__/navMenu.config';
import customizeFormItem from '../__config__/customizeFormItem.config';

// import standardTableListsCustomize from '../__config__/mixins/standardTableListsCustomize';


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

export const KEEP_MODULE_STATE_WHEN_CLICK_MENU = true; // 控制点击按钮菜单时如何显示已经打开的模块
export const KEEP_SAVE_ITEM_TABLE_MANDATORY = false;// 控制当子表没有必填项点击保存时是否必须填写子表信息
export const INSTANCE_ROUTE = 'instanceRoute';
export const INSTANCE_ROUTE_QUERY = 'instanceRouteQuery';
export const MODULE_COMPONENT_NAME = 'moduleComponentName';
export const DB_NAME = 'r3';
export const DB_SCHEMA_NETWORK = 'Network';
export const ENABLE_NETWORK_MONITOR = () => (window.ProjectConfig && typeof window.ProjectConfig.enableNetworkMonitor === 'boolean' ? window.ProjectConfig.enableNetworkMonitor : project.enableNetworkMonitor);
export const SLOW_NETWORK_THRESHOLD = 0;
export const HAS_BEEN_DESTROYED_MODULE = 'destroyedModule';
// 需要走全局公共网关的接口
let globalDefaultGateWay = [
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


// project.customizeMixins = {
//   standardTableListsCustomize: standardTableListsCustomize()
// };
// 导出表的拓展属性、字段扩展属性配置。

export const extentionForColumn = () => (window.ProjectConfig && window.ProjectConfig.extentionForColumn ? window.ProjectConfig.extentionForColumn : configForColumn);

// 导出表的拓展属性、字段扩展属性配置。
export const extentionForTable = () => (window.ProjectConfig && window.ProjectConfig.extentionForTable ? window.ProjectConfig.extentionForTable : configForTable);

// 配置路由刷新浏览器回到dashboard界面
export const backDashboardRoute = () => (window.ProjectConfig && window.ProjectConfig.backDashboardRoute ? window.ProjectConfig.backDashboardRoute.concat(backDashboardRoutes) : backDashboardRoutes);
// 配置内置自定义界面requestURL
export const custommizedRequestUrl = () => (window.ProjectConfig && window.ProjectConfig.custommizedRequestURL ? window.ProjectConfig.custommizedRequestURL : custommizedRequestURL);

export const connector = () => (window.ProjectConfig && window.ProjectConfig.connector ? window.ProjectConfig.connector : connectorConfig);
export const functionPowerRequestURL = () => (window.ProjectConfig && window.ProjectConfig.functionPowerRequestURL ? window.ProjectConfig.functionPowerRequestURL : project.functionPowerRequestURL);
export const Version = () => (window.ProjectConfig && window.ProjectConfig.Version && window.ProjectConfig.Version === '1.4' ? '1.4' : '1.3');
export const interlocks = () => (window.ProjectConfig && typeof window.ProjectConfig.interlocks === 'boolean' ? window.ProjectConfig.interlocks : project.interlocks);
export const enableGateWay = () => (window.ProjectConfig && typeof window.ProjectConfig.enableGateWay === 'boolean' ? window.ProjectConfig.enableGateWay : project.enableGateWay);
export const enableCustomInterface = () => (window.ProjectConfig && typeof window.ProjectConfig.enableCustomInterface === 'boolean' ? window.ProjectConfig.enableCustomInterface : project.enableCustomInterface);
export const enableKeepAlive = () => (window.ProjectConfig && typeof window.ProjectConfig.enableModuleKA === 'boolean' ? window.ProjectConfig.enableModuleKA : project.enableModuleKA);
export const enableInitializationRequest = () => (window.ProjectConfig && typeof window.ProjectConfig.enableInitializationRequest === 'boolean' ? window.ProjectConfig.enableInitializationRequest : project.enableInitializationRequest);
export const specifiedGlobalGateWay = () => (window.ProjectConfig && window.ProjectConfig.specifiedGlobalGateWay ? window.ProjectConfig.specifiedGlobalGateWay : project.specifiedGlobalGateWay);
export const mock = () => (window.ProjectConfig && typeof window.ProjectConfig.mock === 'boolean' ? window.ProjectConfig.mock : project.mock);
export const enableTabLists = () => (window.ProjectConfig && typeof window.ProjectConfig.enableTabLists === 'boolean' ? window.ProjectConfig.enableTabLists : project.enableTabLists);

export const enableHistoryAndFavoriteUI = () => (window.ProjectConfig && typeof window.ProjectConfig.enableHistoryAndFavoriteUI === 'boolean' ? window.ProjectConfig.enableHistoryAndFavoriteUI : project.enableHistoryAndFavoriteUI);

export const enableHistoryAndFavorite = () => (window.ProjectConfig && typeof window.ProjectConfig.enableHistoryAndFavorite === 'boolean' ? window.ProjectConfig.enableHistoryAndFavorite : project.enableHistoryAndFavorite);
export const getTouristRoute = () => (window.ProjectConfig && window.ProjectConfig.touristRoute ? window.ProjectConfig.touristRoute : project.touristRoute);
export const getCustomizeWaterMark = () => (window.ProjectConfig && window.ProjectConfig.customizeWaterMark ? window.ProjectConfig.customizeWaterMark : project.customizeWaterMark);
export const encryptedPassword = () => (window.ProjectConfig && window.ProjectConfig.encryptedPassword ? window.ProjectConfig.encryptedPassword : project.encryptedPassword);
export const isItemTableNewValidation = () => (window.ProjectConfig && typeof window.ProjectConfig.isItemTableNewValidation === 'boolean' ? window.ProjectConfig.isItemTableNewValidation : project.isItemTableNewValidation);
export const isCommonTable = () => (window.ProjectConfig && typeof window.ProjectConfig.isCommonTable === 'boolean' ? window.ProjectConfig.isCommonTable : project.isCommonTable);
export const enableRestrictSave = () => (window.ProjectConfig && typeof window.ProjectConfig.enableRestrictSave === 'boolean' ? window.ProjectConfig.enableRestrictSave : project.enableRestrictSave);
export const cbs = () => (window.ProjectConfig && window.ProjectConfig.cbs ? window.ProjectConfig.cbs : project.cbs || {});
export const layoutDirection = () => ((window.ProjectConfig && typeof window.ProjectConfig.layoutDirection === 'boolean' ? window.ProjectConfig.layoutDirection : project.layoutDirection) || false);
export const contentConfig = () => (window.ProjectConfig && window.ProjectConfig.contentConfig ? window.ProjectConfig.contentConfig : project.contentConfig);
export const REQUEST_PENDDING_EXPIRE = () => (window.ProjectConfig && window.ProjectConfig.requestPenddingExpire ? window.ProjectConfig.requestPenddingExpire : project.requestPenddingExpire);
export const encodeControl = () => (window.ProjectConfig && typeof window.ProjectConfig.encodeControl === 'boolean' ? window.ProjectConfig.encodeControl : project.encodeControl);
export const logoutTips = () => (window.ProjectConfig && typeof window.ProjectConfig.logoutTips === 'boolean' ? window.ProjectConfig.logoutTips : project.logoutTips);
export const enableKAQueryDataForUser = () => (window.ProjectConfig && typeof window.ProjectConfig.enableKAQueryDataForUser === 'boolean' ? window.ProjectConfig.enableKAQueryDataForUser : project.enableKAQueryDataForUser);
export const dateStorageTime = () => (window.ProjectConfig && window.ProjectConfig.dateStorageTime ? window.ProjectConfig.dateStorageTime : project.dateStorageTime);
export const ossRealtimeSave = () => (window.ProjectConfig && typeof window.ProjectConfig.ossRealtimeSave === 'boolean' ? window.ProjectConfig.ossRealtimeSave : project.ossRealtimeSave);
export const blockFullOperation = () => (window.ProjectConfig && typeof window.ProjectConfig.blockFullOperation === 'boolean' ? window.ProjectConfig.blockFullOperation : project.blockFullOperation);
export const customizeMixins = () => (window.ProjectConfig && window.ProjectConfig.customizeMixins ? window.ProjectConfig.customizeMixins : project.customizeMixins || {});
// export const REQUEST_PENDDING_EXPIRE = 1000 * 2;
export const enableActivateSameCustomizePage = () => (window.ProjectConfig && typeof window.ProjectConfig.enableActivateSameCustomizePage === 'boolean' ? window.ProjectConfig.enableActivateSameCustomizePage : project.enableActivateSameCustomizePage);
export const filterUrlForNetworkScript = data => (window.ProjectConfig && window.ProjectConfig.filterUrlForNetworkScript ? window.ProjectConfig.filterUrlForNetworkScript(data) : project.filterUrlForNetworkScript);
export const getFilterUrlForNetworkData = () => (window.ProjectConfig && window.ProjectConfig.filterUrlForNetwork ? window.ProjectConfig.filterUrlForNetwork : project.filterUrlForNetwork);
export const navConfig = () => (window.ProjectConfig && window.ProjectConfig.navMenuConfig ? window.ProjectConfig.navMenuConfig : navMenuConfig);
export const notificationOfMain = () => (window.ProjectConfig && typeof window.ProjectConfig.notificationOfMain === 'boolean' ? window.ProjectConfig.notificationOfMain : project.notificationOfMain);
export const formItemConfig = () => (window.ProjectConfig && window.ProjectConfig.formItemConfig ? window.ProjectConfig.formItemConfig : customizeFormItem);

export const isFilterTable = () => (window.ProjectConfig && window.ProjectConfig.isFilterTable ? window.ProjectConfig.isFilterTable : project.isFilterTable);
export const listDefaultColumn = () => (window.ProjectConfig && window.ProjectConfig.listDefaultColumn ? window.ProjectConfig.listDefaultColumn : 4); // 配置列表查询条件一行几列展示

export const getProjectQuietRoutes = () => {
  const { quietRoutes } = window.ProjectConfig || {};
  return (defaultQuietRoutes.concat(quietRoutes || [])) || [];
};

export const defaultrange = () => (window.ProjectConfig && window.ProjectConfig.defaultrange ? window.ProjectConfig.defaultrange : null); // 配置外健查询下拉每页展示多少条数据


export const DashboardPage = () => (window.ProjectConfig && window.ProjectConfig.DashboardPage ? window.ProjectConfig.DashboardPage : null); // 根路由界面
export const floatingFilter = () => (window.ProjectConfig && typeof window.ProjectConfig.floatingFilter === 'boolean' ? window.ProjectConfig.floatingFilter : true);


export const globalGateWay = () => {
  const { globalGateWayConfig } = window.ProjectConfig || {};
  globalDefaultGateWay = globalDefaultGateWay.concat(globalGateWayConfig || []);
  return globalDefaultGateWay;
};

export const setComponentsProps = () => (window.ProjectConfig && window.ProjectConfig.setComponentsProps ? window.ProjectConfig.setComponentsProps : () => ({}));
export const agGridOptions = () => (window.ProjectConfig && window.ProjectConfig.agGridOptions ? window.ProjectConfig.agGridOptions : {}); // ag表格的配置
export const messageSwitch = () => (window.ProjectConfig && window.ProjectConfig.messageSwitch ? window.ProjectConfig.messageSwitch : false); // 消息设置
export const formItemMixins = () => (window.ProjectConfig && window.ProjectConfig.formItemMixins ? window.ProjectConfig.formItemMixins : false); // 添加表单mixins
export const autoGatewayUrl = () => (window.ProjectConfig && window.ProjectConfig.autoGatewayUrl ? window.ProjectConfig.autoGatewayUrl : false); // 是否自动请求网关


// 获取表单网关
export const getGatewayValue = (key) => {
  const getServiceIdMap = JSON.parse(window.localStorage.getItem('serviceIdMap'));
  return getServiceIdMap[key];
}; 
