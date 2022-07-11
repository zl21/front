import launchApp from '../src/app.entry'
import network, { urlSearchParams } from '../src/__utils__/network'
import getModuleName from '../src/__utils__/getModuleName'
import getObjdisType from '../src/__utils__/getObjdisType'
import {
  getSessionObject,
  updateSessionObject,
  deleteFromSessionObject,
  removeSessionObject,
} from '../src/__utils__/sessionStorage'
import store from '../src/__config__/store.config'
import router from '../src/__config__/router.config'
import extentionForColumn from '../src/constants/extentionPropertyForColumn'
import extentionForTable from '../src/constants/extentionPropertyForTable'

import externalComponents from '../src/__config__/externalComponents'

import { menuClick } from '../src/__config__/event.config'
import { connector } from '../src/constants/global'
import '../src/constants/dateApi'
import { packageMessage, hookAJAX, requestHello, setXss, setHookAJAX } from '../src/assets/js/entry.constant'

import { getKeepAliveModuleName } from '../src/__config__/router.navigation.guard'
import '../src/constants/dateApi'
// import packJson from '../package.json'
import '../src/index.less'

// install
const install = (Vue, R3 = {}) => {
  // 加载
  if (install.installed) {
    return
  }
  if (window.R3 && window.R3.default) {
    window.R3 = R3
  } else if (!window.R3) {
    window.R3 = R3
  }

  Vue.prototype.$network = R3.network
  Vue.prototype.$urlSearchParams = R3.urlSearchParams
  Vue.prototype.$store = R3.store
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
    if (projectConfig.externalModules) {
      const m = projectConfig.externalModules
      // 将外部自定义界面入口模块的标识key置为大写
      projectConfig.externalModules = Object.keys(m).reduce((a, c) => {
        a[c.toUpperCase()] = m[c]
        return a
      }, {})
    }

    window.ProjectConfig = Object.assign({}, projectConfig, packageMessage)
    launchApp(projectConfig)
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
  install, // 添加框架挂载
  connector: connector(), // 1.3框架公共模块包使用
  store,
  setXss,
  hookAJAX,
  setHookAJAX,
  requestHello,
  config: {
    extentionForColumn,
    extentionForTable,
  },
  components: {
    ...externalComponents,
  },
}