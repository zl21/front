
XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
// here "this" points to the XMLHttpRequest Object.
const newSend = function (vData) {
  if (window.isEncryption) {
    const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
    const value = `${randomKey}${btoa(vData)}`; 
    this.realSend(value);
  } else {
    this.realSend(vData);
  }
};
XMLHttpRequest.prototype.send = newSend;
