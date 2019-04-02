class  Upload {
	constructor(obj){//新建父类
		this.imgSize = obj.imgSize || 1024 * 1024 * 10; // 10MB;
		this.file = obj.target;
		this.event = obj;
		this.url = obj.url || '';
		this.Method = obj.Method || 'POST';
		this.sendData = obj .sendData || {};
		if(this.file.size > this.imgSize ) {
		  // 文件大小自定义限制
			  if(Object.prototype.hasOwnProperty.call(this.event,'onerror')){
			  this.event.onerror('文件内容过大');
			}
			return;
		}else{
		  this.init(this.file);
		}
	}
    init (file){
      this.transformFileToFormData(file);
    }
    // 将file转成dataUrl
    transformFileToDataUrl(file){

        // 封装好的函数
        const reader = new FileReader();
      // file转dataUrl是个异步函数，要将代码写在回调里
        reader.onload = function(e) {
			    if(Object.prototype.hasOwnProperty.call(this.event,'onload') && typeof this.event.onload === 'function'){
			      	this.event.onload(e);
			     }
        };
       reader.onloadstart = function(e) {
          if(Object.prototype.hasOwnProperty.call(this.event,'onloadstart')  && typeof this.event.onloadstart === 'function'){
              this.event.onloadstart(e);
           }
        };
       reader.onloadend= function(e){
          if(Object.prototype.hasOwnProperty.call(this.event,'onloadend') && typeof this.event.onloadend === 'function'){
               this.event.onloadend(e);
          }
        }
       reader.onerror= function(e){
          if(Object.prototype.hasOwnProperty.call(this.event,'onerror') && typeof this.event.onerror === 'function'){
             this.event.onerror(e);
          }
        }

        reader.readAsDataURL(file);
    }


    // 将File append进 FormData
    transformFileToFormData(file) {
      const formData = new FormData();
       formData.append('file', file);
       Object.keys(this.sendData).forEach((item) =>{
            formData.append(item, this.sendData[item]);
       });
       // 上传图片
      this.uploadImg(formData);
    }

    uploadImg (formData) {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e)=>{
        if(Object.prototype.hasOwnProperty.call(this.event,'progress') && typeof this.event.progress === 'function'){
          this.event.progress(e,e.loaded / e.total);
        }
      }, false);
      // 错误监听
      xhr.addEventListener('error', (e)=>{
        if(Object.prototype.hasOwnProperty.call(this.event,'onerror') && typeof this.event.onerror === 'function'){
          this.event.onerror(e);
        }
      }, false);
      let that = this;
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              const result = JSON.parse(xhr.responseText);
              if (xhr.status === 200) {
                  // 上传成功
                   if(Object.prototype.hasOwnProperty.call(that.event,'success') && typeof that.event.success === 'function'){
                     that.event.success(result);
                   }
              } else {
                  // 上传失败
                  if(Object.prototype.hasOwnProperty.call(that.event,'onerror') && typeof that.event.onerror === 'function'){
                    that.event.onerror(result);
                   }
              }
          }
      };
      xhr.open(this.Method, this.url , true);
      xhr.send(formData);
    }
}

export {Upload};
