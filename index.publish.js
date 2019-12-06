import launchApp from './src/app.entry';
import network, { urlSearchParams } from './src/__utils__/network';
import getModuleName from './src/__utils__/getModuleName';
import store from './src/__config__/store.config';
import extentionForColumn from './src/constants/extentionPropertyForColumn';
import extentionForTable from './src/constants/extentionPropertyForTable';
import PopDialog from './src/__component__/PopDialog';
import ContentDisplayArea from './src/__component__/ContentDisplayArea';
import ComAttachFilter from './src/__component__/ComAttachFilter';
import DownComponent from './src/__component__/DownComponent';
import WaterMark from './src/__component__/WaterMark';
import SearchForm from './src/__component__/form/SearchForm';
import FilterTree from './src/__component__/Tree/FilterTree';
import SelectTree from './src/__component__/Tree/SelectTree';


import { menuClick } from './src/__config__/event.config';


const validateConfig = config => ({
  isQualified: true,
  message: 'xxx'
});

export default {
  version: '1.7.2',
  temporaryVersion: '1.7.9',
  /**
   * @param projectConfig 项目配置
   * projectConfig: {
   *   image: {
   *     enterpriseLogo: '',  // 公司 Logo 图片
   *     enterpriseBanner: '', // 公司Banner 图片
   *   }, // 此配置项必传
   *   globalComponent: {
   *     Login: '',  // 登录页
   *     WelcomePage: '', // 欢迎页
   *   }, // 此配置项必传。
   *   externalModules: { // 项目自定义界面组件入口
   *      keyOne: VueComponentOne,
   *      keyTwo: VueComponentTwo,
   *      ...
   *   }, // 如无自定义界面，此配置项可不传参。
   *   externalModals: {  // 项目自定义弹框（模态框）组件
   *     keyOne: VueComponentOne,
   *     keyTwo: VueComponentTwo,
   *     ...
   *   }, // 如无自定义弹窗，此配置项可不传参。
   *   projectRoutes: [  // 项目自定义路由，一般情况下用不到此配置。
   *     {
   *       path: '/register',
   *       component: VueComponentForRegister
   *     }
   *   ], // 此配置项可不传参。
   *   quietRoutes: [ '/register' ],  // 项目中针对403的请求，都会默认跳转到登录页面。处于静默路由列表的路由界面则不进行跳转。一般情况用不到此配置。默认值为[]，此配置项可不传参。
   *   Version： '1.4', // 后台框架API版本号，目前只支持['1.3', '1.4']其中一个。默认值是"1.4"，此配置项可不传参。
   *   enableGateWay: true, // 开启 | 关闭 网关(默认开启)，此配置项可不传参。
   *   enableJflow: true, // 开启JFlow插件功能（默认关闭），此配置项可不传参。
   *   jflowRequestDomain： 'http(s)://domain:port', // jflow请求转发的域名或者IP（只有在enableJflow为true时生效），此配置项可不传参。
   *   ignoreGateWayPattern: RegExp 正则表达是，表示项目中需要忽略网关规则的那些指定请求url。
   *   extentionForTable: [], // 项目自定义“表”扩展属性列表
   *   extentionForColumn: [], // 项目自定义“字段”扩展属性列表
   *   enableModuleKA: true, //  启用KeepAlive
   *   enableTabLists: true, // 启用TabLits模块页签切换
   *   enableHistoryAndFavorite: true, // 是否开启收藏与最近使用功能
   *   touristRoute： '/login', // 游客路由，默认为'/login'，表示未登录情况默认跳转的路由
   *   enableInitializationRequest: true, //是否开启初始化请求，默认为开启
   * }
   */
  launchApplication(projectConfig) {
    const validateInfo = validateConfig(projectConfig);
    if (!validateInfo.isQualified) {
      alert(validateInfo.message);
      return;
    }
    if (projectConfig.externalModules) {
      const m = projectConfig.externalModules;
      // 将外部自定义界面入口模块的标识key置为大写
      projectConfig.externalModules = Object.keys(m).reduce((a, c) => {
        a[c.toUpperCase()] = m[c];
        return a;
      }, {});
    }
    window.ProjectConfig = projectConfig;

    launchApp(projectConfig);
  },
  urlSearchParams,
  getModuleName,
  menuClick,
  network,
  store,
  config: {
    extentionForColumn,
    extentionForTable,
  },
  components: {
    ContentDisplayArea,
    PopDialog,
    ComAttachFilter,
    DownComponent,
    WaterMark,
    SearchForm,
    FilterTree,
    SelectTree,
  }
};
