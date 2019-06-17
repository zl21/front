/**
 * 框架增加功能：在任意可被执行代码片段，任意位置，用以下方式监听R3框架关于所有Http请求事件，可以即时捕获任意请求获得响应（成功响应| |失败响应）后的结果
 1、所有通过networkifr#的XHR请求，得到响应后，都将触发一个名为"network"的自定义事件。
 2、可以通过以上示例代码尝试利用此功能来解决需要等待某些接囗响应后才可以触发的逻辑，现在框架码中应该都是使用"延时"来达到相似目的，延时的问题在于，设置的延时计数器不一定
 3、如果你需要利用此功能，并且在某个地方设置了监听器，切记在合适的时候将其移除。
 */
const networkEventListener = (event) => {
  // 你可以在event.detail中拿到以下数据：
  // 你可以根据以下数据的信息，指导程序、组件的部分逻辑，包括但不限于：
  // e.g. (1). 在标准列表界面，你希望在/p/cs/getTableQuery接口得到响应以后再去调用/p/cs/QueryList接口请求数据，用以确保在只调用一次列表请求接口的前提下，可以确保第一次QueryList接口请求时，其携带了由getTableQuery接口返回的某些默认查询条件。
  // e.g. (2). 在标准列表界面，你希望在/p/cs/batchDelete接口响应失败时，立刻调用一次/p/cs/QueryList接口，刷新当前列表页的数据。至于怎么刷新，你可以在得到/p/cs/batchDelete失败的响应后，增加一些自己额外的逻辑。
  console.log('network: ',
    event.detail.url, // 原始请求的url（不含网关）
    event.detail.fulfilled, // 该请求状态fulfilled => (true: 请求成功, false:请求失败), 与rejected永远相反
    event.detail.rejected, // 该请求状态rejected => (true: 请求失败, false: 请求成功), 与fulfilled永远相反
    event.detail.urlGateway, // 该请求的网关
    event.detail.response); // 该请求的响应值(成功或者失败都会有响应值，响应值即axios的response)
};
window.addEventListener('network', networkEventListener);


// Important: 所有设置了监听器的地方，一定要在合适的时机将其移除。
// e.g.
// eslint-disable-next-line no-unused-vars
const VueCompoent = {
  template: '<h1>network listener usage',
  method: {
    networkListenerCallBack(event) {
      const { detail } = event;
      // todo sth:
      console.log(detail);
    }
  },
  created() {
    // 为了在组件销毁时将其移除，监听函数一定不能是一个匿名函数。
    window.addEventListener('network', this.networkListenerCallBack);
  },
  beforeDestroy() {
    window.removeEventListener('network', this.networkListenerCallBack);
  }
};
