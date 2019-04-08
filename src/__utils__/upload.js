class Upload {
  constructor(obj) { // 新建父类
    this.imgSize = obj.imgSize || 1024 * 1024 * 10; // 10MB;
    this.file = obj.target;
    this.event = obj;
    this.url = obj.url || '';
    this.Method = obj.Method || 'POST';
    this.sendData = obj.sendData || {};
    if (this.file.size > this.imgSize) {
      if (Object.prototype.hasOwnProperty.call(this.event, 'onerror')) {
        this.event.onerror('文件内容过大');
      }
      return;
    }
    this.init(this.file);
  }

  init(file) {
    this.transformFileToDataUrl(file);
  }

  // 将file转成dataUrl
  transformFileToDataUrl(file) {
    // 封装好的函数
    const reader = new FileReader();
    // file转dataUrl是个异步函数，要将代码写在回调里
    const self = this;
    reader.onload = function (e) {
      console.log(self.event);
      if (Object.prototype.hasOwnProperty.call(self.event, 'onload') && typeof self.event.onload === 'function') {
        self.event.onload(e);
      }
    };
    reader.onloadstart = function (e) {
      if (Object.prototype.hasOwnProperty.call(self.event, 'onloadstart') && typeof self.event.onloadstart === 'function') {
        self.event.onloadstart(e);
      }
    };
    reader.onloadend = function (e) {
      if (Object.prototype.hasOwnProperty.call(self.event, 'onloadend') && typeof self.event.onloadend === 'function') {
        self.event.onloadend(e);
        self.transformFileToFormData(file);
      }
    };
    reader.onerror = function (e) {
      if (Object.prototype.hasOwnProperty.call(this.event, 'onerror') && typeof this.event.onerror === 'function') {
        this.event.onerror(e);
      }
    };

    reader.readAsDataURL(file);
  }


  // 将File append进 FormData
  transformFileToFormData(file) {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(this.sendData).forEach((item) => {
      formData.append(item, this.sendData[item]);
    });
    // 上传图片
    this.uploadImg(formData);
  }

  uploadImg(formData) {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (Object.prototype.hasOwnProperty.call(this.event, 'progress') && typeof this.event.progress === 'function') {
        this.event.progress(e, e.loaded / e.total);
      }
    }, false);
    // 错误监听
    xhr.addEventListener('error', (e) => {
      if (Object.prototype.hasOwnProperty.call(this.event, 'onerror') && typeof this.event.onerror === 'function') {
        this.event.onerror(e);
      }
    }, false);
    const that = this;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          // 上传成功
          if (Object.prototype.hasOwnProperty.call(that.event, 'success') && typeof that.event.success === 'function') {
            that.event.success(result);
          }
        } else if (Object.prototype.hasOwnProperty.call(that.event, 'onerror') && typeof that.event.onerror === 'function') {
          that.event.onerror(result);
        }
      }
    };
    xhr.open(this.Method, this.url, true);
    xhr.send(formData);
  }
}

export default Upload;
