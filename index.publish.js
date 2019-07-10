import launchApp from './src/app.entry';
import network, { urlSearchParams } from './src/__utils__/network';
import getModuleName from './src/__utils__/getModuleName';

const validateConfig = config => ({
  isQualified: true,
  message: 'xxx'
});

export default {
  version: '1.0.2',
  /**
   * @param projectConfig 项目配置
   * projectConfig: {
   *   image: {
   *     enterpriseLogo: '',  // 公司 Logo 图片
   *     enterpriseBanner: '', // 公司Banner 图片
   *   },
   *   globalComponent: {
   *     Login: '',  // 登录页
   *     WelcomePage: '', // 欢迎页
   *   },
   *   externalModules: { // 项目自定义界面组件入口
   *      key-1: VueComponent-1,
   *      key-2: VueComponent-2,
   *      ...
   *   },
   *   externalModals: {  // 项目自定义弹框（模态框）组件
   *     key-1: VueComponent-1,
   *     key-2: VueComponent-2,
   *     ...
   *   },
   *   projectRoutes: [  // 项目自定义路由
   *     {
   *       path: '/XXX',
   *       component: VueComponent-For-XXX
   *     }
   *   ],
   *   quietRoutes: [  // 项目中针对403的请求，都会默认跳转到登录页面。处于静默路由列表的路由界面则不进行跳转。
   *     '/register'
   *   ]
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
  network,
};
