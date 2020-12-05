import md5 from 'md5';

XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
window.isEncryption = true;
XMLHttpRequest.prototype.open = (function (open) {
  return function () {
    open.apply(this, arguments);
    if (window.isEncryption) {
      this.setRequestHeader('Content-Hash', 'b326b5062b2f0e69046810717534cb09');
    }
  };
}((new XMLHttpRequest()).open));
const newSend = function (data) {
  const dataType = Object.prototype.toString.call(data);
  // console.error(data,dataType);
  let sendData = data;
  if (window.isEncryption) {
    switch (dataType) {
      case '[object Null]':
      case '[object String]':
        sendData = btoa(btoa(md5(`${Math.random()}`)) + btoa(encodeURIComponent(data)));
        break;
      case '[object FormData]':
        if (data && !data.get('file')) {
          const jsonData = {};
          data.forEach((value, key) => jsonData[`${btoa(btoa(md5(`${Math.random()}`)) + btoa(encodeURIComponent(key)))}`] = btoa(btoa(md5(`${Math.random()}`)) + btoa(encodeURIComponent(value))));
          const form = new FormData();
          for (const key in jsonData) {
            form.append(key, jsonData[key]);
          }
          sendData = form;
        }
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

function btoa(str) {
  return new Buffer.from(str).toString('base64');
}

function atob(str) {
  return new Buffer.from(str, 'base64').toString();
}

const decrypt = str => decodeURIComponent(atob(atob(str).substring(btoa(md5(`${Math.random()}`)).length)));
export { decrypt };
