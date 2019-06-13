# burgeon-r3

> Usage
```
import R3 from 'burgeon-r3';

// 企业Logo、Banner配置信息
import enterpriseLogo from './src/assets/image/logo.png';
import enterpriseBanner from './src/assets/image/banner.png';
import Login from './src/component/Login';
import WelcomePage from './src/component/WelcomePage'

R3.launchApplication({
  image: {
    enterpriseLogo, // 企业Logon
    enterpriseBanner,  // 企业Banner
  },
  globalComponent: {
    Login,  // 项目自定义的登录页
    WelcomePage // 项目自定义欢迎页
  },
  externalModules: {
    KEY1: {  // R3自定义界面组件
      component: {
        template: '<h1>Here is customized component.</h1>'
      }
    }
    ...
  }
});
```
