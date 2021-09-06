import launchApp from './src/app.entry';
import network, { urlSearchParams } from './src/__utils__/network';
import getModuleName from './src/__utils__/getModuleName';
import getObjdisType from './src/__utils__/getObjdisType';
import {
  getSessionObject, updateSessionObject, deleteFromSessionObject, removeSessionObject
} from './src/__utils__/sessionStorage';
import store from './src/__config__/store.config';
import router from './src/__config__/router.config';
import extentionForColumn from './src/constants/extentionPropertyForColumn';
import extentionForTable from './src/constants/extentionPropertyForTable';
import PopDialog from './src/__component__/PopDialog.vue';
import ContentDisplayArea from './src/__component__/ContentDisplayArea.vue';
import ComAttachFilter from './src/__component__/ComAttachFilter.vue';
import DownComponent from './src/__component__/DownComponent.vue';
import WaterMark from './src/__component__/WaterMark.vue';
import VerticalMenu from './src/__component__/VerticalMenu.vue';
import NavigatorVertical from './src/__component__/NavigatorVertical.vue';
import NaVertical from './src/__component__/NaVertical.vue';
import ComAutoComplete from './src/__component__/ComAutoComplete.vue';

import ImportDialog from './src/__component__/ImportDialog.vue';
import SearchForm from './src/__component__/form/SearchForm.vue';//
import FilterTree from './src/__component__/Tree/FilterTree.vue';
import SelectTree from './src/__component__/Tree/SelectTree.vue';
import DocFile from './src/__component__/docfile/DocFileComponent.vue';
import Login from './src/__component__/Login/LoginCore';
import { menuClick } from './src/__config__/event.config';
import { connector } from './src/constants/global';
import './src/constants/dateApi';

import { getKeepAliveModuleName } from './src/__config__/router.navigation.guard';
import './src/constants/dateApi';
import packJson from './package.json';
import './src/index.less';


const validateConfig = config => ({
  isQualified: true,
  message: 'xxx'
});
const packageMessage = {
  version: packJson.version,
  packageTime: new Date(),
  user: 'local',
};
const setXss = ()=>{
  // 安全攻击
  let htmlEncodeByRegExp = (str) => {
    let s = str;
    if (str.length === 0) { return ''; }
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/ /g, '&nbsp;');
    s = s.replace(/\'/g, '&#39;'); //eslint-disable-line
    s = s.replace(/\"/g, '&quot;'); //eslint-disable-line
    return s;
  }
  document.body.addEventListener('input', function (e) {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
      e.target.value = htmlEncodeByRegExp(e.target.value)
    }
  });
}

const requestHello = async function () {
  const serviceId = window.localStorage.getItem('serviceId')
  const url = serviceId ? `/${serviceId}/p/cs/hello`: '/p/cs/hello'
  await network.get(url,undefined,{noServiceId: true}).then((res) => {
    // 此方法用于向外界（JFlow）提供用户信息。供外部处理自己的需要逻辑。
    DispatchEvent('userReady', {
      detail: {
        userInfo: JSON.parse(JSON.stringify(res.data))
      }
    });
    if (res.status === 200 && res.data.code === 0) {
      store.commit('global/updataUserInfoMessage', {
        userInfo: res.data
      });
      window.localStorage.setItem('userInfo', JSON.stringify(res.data));
      window.localStorage.setItem('sessionCookie',res.data.sessionCookie);
    }
  });
}

export default {
  ...packageMessage,
  /**
   * @param projectConfig 项目配置
   * projectConfig: {
   *   image: {
   *     enterpriseLogo: '',  // 公司 Logo 图片
   *     enterpriseBanner: '', // 公司Banner 图片
   *     expandImg: '',   // 展开图片
   *     collapseImg: '', // 折叠图片
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
   *   externalTreeDatas: { // 树形结构列表配置数据信息入口
   *      keyOne: ()=>{},
   *      keyTwo: ()=>{},
   *      ...
   *   }, // 如无自定义界面，此配置项可不传参。
   *   externalModals: {  // 项目自定义弹框（模态框）组件
   *     keyOne: VueComponentOne,
   *     keyTwo: VueComponentTwo,
   *     ...
   *   }, // 如无自定义弹窗，此配置项可不传参。
   *   externalPluginModules: {  // 项目引用插件界面
   *     keyOne: VueComponentOne,
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
   *   ignoreGateWayPattern: RegExp 正则表达是，表示项目中需要忽略网关规则的那些指定请求url。
   *   extentionForTable: [], // 项目自定义“表”扩展属性列表
   *   extentionForColumn: [], // 项目自定义“字段”扩展属性列表
   *   enableModuleKA: true, //  启用KeepAlive
   *   enableTabLists: true, // 启用TabLits模块页签切换
   *   enableHistoryAndFavorite: true, // 是否开启收藏与最近使用功能
   *   touristRoute： '/login', // 游客路由，默认为'/login'，表示未登录情况默认跳转的路由
   *   enableInitializationRequest: true, //是否开启初始化请求，默认为开启
   *   externalTreeDatas:{},//树结构列表界面数据配置
   *   cbs: {
   *     loginCb: Function
   *   }
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

    window.ProjectConfig = Object.assign({}, projectConfig, packageMessage);
    launchApp(projectConfig);
  },
  urlSearchParams,
  getModuleName,
  menuClick,
  network,
  router,
  getObjdisType, // 获取当前单对象所配置的类型（H/V），参数：table:'主表表名'
  getSessionObject, // 获取sessionStorage存储数据getSessionObject('name')
  updateSessionObject, // 更新sessionStorage存储数据，参数{k:'key',v:'value'}
  deleteFromSessionObject, // 删除sessionStorage存储数据deleteFromSessionObject('name','需要删除的key')
  removeSessionObject, // 删除sessionStorage存储数据removeSessionObject('name')
  getKeepAliveModuleName,
  connector: connector(), // 1.3框架公共模块包使用
  store,
  setXss:setXss,
  requestHello,
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
    DocFile,
    ImportDialog,
    VerticalMenu,
    NavigatorVertical,
    NaVertical,
    ComAutoComplete,
    Login,
  }
};
