import md5 from 'md5'
import packJson from '../../../package.json'
import { getGuid } from '../../__utils__/random'
import router from '../../__config__/router.config';
import store from '../../__config__/store.config'
import { enableInitializationRequest, specifiedGlobalGateWay, backDashboardRoute, HAS_BEEN_DESTROYED_MODULE } from '../../constants/global'
import i18n from './i18n'
import network from '../../__utils__/network';
import { DispatchEvent } from '../../__utils__/dispatchEvent';
import { getLocalObject } from '../../__utils__/localStorage';
import { removeSessionObject, getSessionObject } from '../../__utils__/sessionStorage';
import getObjdisType from '../../__utils__/getObjdisType';
import App from '../../App.vue';
import RouterPush from '../../__utils__/routerback';

let parseInt = window.parseInt;
// 兼容长度大于16位
window.parseInt16 = function(value){
    if(typeof value !=='string'){
      value = JSON.stringify(value);
    }
    if(value && value.match(/[0-9]+/) && value.match(/[0-9]+/)[0].length>15){
      return value.match(/[0-9]+/)[0];
    }else{
      return parseInt(value);
    }
}

if(!window.vm){
  window.vm = {
  
  }
}
// 挂载router和store
if(!window.vm.$router){
  window.vm.$router = router;
}
window.vm.$store = store;

const packageMessage = {
  version: packJson.version,
  packageTime: new Date(),
  user: 'local',
}

function hookAJAX() {
  XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open
  var customizeOpen = function(method, url, async, user, password) {
    this.nativeOpen(method, url, async, user, password)
    let number = Math.floor(Math.random() * 10000)
    let sessionCookie = window.localStorage.getItem('sessionCookie')
    this.setRequestHeader('SSSSS-A', new Date().getTime())
    if (sessionCookie === 'undefined') {
      this.setRequestHeader(
        'SSSSS-B',
        md5('qwertburgeon' + new Date().getTime() + number)
      )
    } else {
      this.setRequestHeader(
        'SSSSS-B',
        md5('qwertburgeon' + new Date().getTime() + number + sessionCookie)
      )
    }
    this.setRequestHeader('SSSSS-C', number)
  }

  XMLHttpRequest.prototype.open = customizeOpen
}

const createDOM = () => {
  const div = document.createElement('div')
  div.setAttribute('id', getGuid())
  if(window.ProjectConfig && window.ProjectConfig.$el){
    window.ProjectConfig.$el.appendChild(div)
  }else{
    document.body.appendChild(div)
  }
  return div
}

const backTouristRoute = () => {
  // window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
  // router.push({ path: getTouristRoute() });
  store.dispatch('global/signout')
}

const setMessage = (data) => {
  window.vm.$Modal.fcError({
    title: i18n.t('feedback.alert'),
    content: data.content,
    cancelType: true,
    titleAlign: 'left',
    mask: true,
    draggable: true,
    closable: false,
    onCancel: () => {
      backTouristRoute()
    },
    onOk: () => {
      backTouristRoute()
    },
  })
}

const getCategory = () => {
  if (enableInitializationRequest()) {
    network
      .post('/p/cs/getSubSystems')
      .then((res) => {
        if (res.data.code === '-1') {
          backTouristRoute()
        } else if (res.data.data.length > 0) {
          store.commit('global/updateMenuLists', res.data.data)
          let serviceIdMaps = res.data.data
            .map((d) => d.children)
            .reduce((a, c) => a.concat(c), [])
            .map((d) => d.children)
            .reduce((a, c) => a.concat(c), [])
            .filter(
              (d) =>
                d.type === 'table' || d.type === 'action' || d.type === 'tree'
            )
            .reduce((a, c) => {
              a[c.value.toUpperCase()] = c.serviceId
              return a
            }, {})
  
          let data = window.localStorage.getItem('serviceIdMap') || '{}';  

          let serviceIdMapData = Object.assign(JSON.parse(data),JSON.parse(JSON.stringify(serviceIdMaps)));
          console.log(serviceIdMapData.R3,'====serviceIdMapData');   
          window.localStorage.setItem(
            'serviceIdMap',
            JSON.stringify(serviceIdMapData)
          )
          DispatchEvent('gatewayReady')
        } else if (getLocalObject('loginStatus') === true) {
          setMessage({ content: i18n.t('messages.NoMenuPermission') })
        }
      })
      .catch(() => {
        if (getSessionObject('loginStatus') === true) {
          setMessage({ content: i18n.t('messages.NoMenuPermission') })
        }
      })
  }
}

const init = ($el) => {
  removeSessionObject(HAS_BEEN_DESTROYED_MODULE);
  const rootDom = createDOM();
  window.vm = new Vue({
    router,
    store,
    i18n,
    render: createElement => createElement(App)
  }).$mount(rootDom);
  
  window.R3message = (data) => {
    window.vm.$Modal.fcError({
      mask: data.mask,
      titleAlign: 'center',
      title: data.title,
      // content: formatJsonEmg
      render: h => h('div', {
        style: {
          padding: '10px 20px 0',
          display: 'flex',
          // alignItems: 'center',
          lineHeight: '16px'
        }
      }, [
        
        h('i', {
          props: {
          },
          style: {
            marginRight: '5px',
            display: 'inline-block',
            'font-size': '28px',
            'margin-right': ' 10px',
            'line-height': ' 1',
            padding: ' 10px 0',
            color: 'red'
          },
          class: 'iconfont iconbj_error fcError '
        }),
        h('div', {
          attrs: {
          },
          domProps: {
          },
          style: `width: 80%;
              margin: 1px;
              margin-bottom: -8px;
              box-sizing: border-box;
              padding: 5px;
              resize: none;
              max-height: 100px;
              max-width: 300px;
              overflow: auto;
              `
        }, data.content)
      ])
    });
  };

  window.getObjdisType = getObjdisType;
  if (backDashboardRoute().filter(path => path === router.currentRoute.fullPath).length > 0) {
    router.push('/');
    setTimeout(() => {
      store.commit('global/updataOpenedMenuLists', []);
    }, 500);
  }
  DispatchEvent('initReady');
};
// 重写实例

new RouterPush().init();


const getGateWayServiceId = ($el) => {
  if (enableInitializationRequest()) {
    if (specifiedGlobalGateWay()) {
      window.localStorage.setItem('serviceId', specifiedGlobalGateWay());
      getCategory();
      setTimeout(() => {
        init($el);
      }, 0);
    } else {
      network.get('/p/c/get_service_id').then((res) => {
        window.localStorage.setItem('serviceId', res.data.data.serviceId);
        getCategory();
        setTimeout(() => {
          DispatchEvent('serviceIdReady', {
            detail: {
              serviceId: res.data.data.serviceId
            }
          });
          init($el);
        }, 0);
      });
    }
  }
};

const requestHello = async function() {
  const serviceId = window.localStorage.getItem('serviceId')
  const url = serviceId ? `/${serviceId}/p/cs/hello` : '/p/cs/hello'
  await network.get(url, undefined, { noServiceId: true }).then((res) => {
    // 此方法用于向外界（JFlow）提供用户信息。供外部处理自己的需要逻辑。
    DispatchEvent('userReady', {
      detail: {
        userInfo: JSON.parse(JSON.stringify(res.data)),
      },
    })
    if (res.status === 200 && res.data.code === 0) {
      store.commit('global/updataUserInfoMessage', {
        userInfo: res.data,
      })
      window.localStorage.setItem('userInfo', JSON.stringify(res.data))
      window.localStorage.setItem('sessionCookie', res.data.sessionCookie)
    }
  })
}

const setXss = () => {
  // 安全攻击
  let htmlEncodeByRegExp = (str) => {
    let s = str
    if (str.length === 0) {
      return ''
    }
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')
    s = s.replace(/ /g, '&nbsp;')
    s = s.replace(/\'/g, '&#39;') //eslint-disable-line
    s = s.replace(/\"/g, '&quot;') //eslint-disable-line
    return s
  }
  document.body.addEventListener('input', function(e) {
    const tagName = e.target.tagName.toLowerCase()
    if (tagName === 'input' || tagName === 'textarea') {
      e.target.value = htmlEncodeByRegExp(e.target.value)
    }
  })
}

const setHookAJAX = (callback) => {
  // 接口加密拦截
  XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open
  var customizeOpen = function(method, url, async, user, password) {
    this.nativeOpen(method, url, async, user, password)
    callback(this)
  }
  XMLHttpRequest.prototype.open = customizeOpen
}

export { packageMessage, hookAJAX, createDOM, getCategory, getGateWayServiceId, init, requestHello, setXss, setHookAJAX }
