
XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
// here "this" points to the XMLHttpRequest Object.
window.isEncryption = true;
XMLHttpRequest.prototype.open = (function (open) {
  return function () {
    // 执行原生 open 方法
    open.apply(this, arguments);
    // 设置默认的 header
    if (window.isEncryption) {
      this.setRequestHeader('Content-Hash', 'b326b5062b2f0e69046810717534cb09');
    }
  };
}((new XMLHttpRequest()).open));

const newSend = function (data) {
  const dataType = Object.prototype.toString.call(data);
  let sendData = data;
  if (window.isEncryption) {
    switch (dataType) {
      case '[object String]':
        sendData = btoa(btoa(window.MD5(Math.random())) + btoa(encodeURIComponent(data)));
        break;
      default:
        break;
    }
    this.realSend(sendData);
  } else {
    this.realSend(sendData);
  }
};

XMLHttpRequest.prototype.send = newSend;
