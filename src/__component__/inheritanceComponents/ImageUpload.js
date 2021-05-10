/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * ImageUpload组件自定义
 */

import { ImageUpload } from '@syman/ark-ui-bcl';
// import ImageUpload from 'arkui_BCL/ImageUpload';
import network from '../../__utils__/network';
import { SetPlaceholder ,SetDisable} from './setProps';
class CustomImageUpload {
  constructor(item) {
    this.item = item;
    this.Vm = Object.create(ImageUpload);
    this.mergeProps();   
    this.mergeMethods(); 
  }

  init() {
    return {
      Components:this.Vm,
      props:this.props
    };

  }

   
 

  // 合并props
  mergeProps() {
    this.props = {
      PropsData:{
        readonly: new SetDisable(this.item).init(), //控制字段是否可编辑
        disabled:new SetDisable(this.item).init(),
        url: '/ad-app/p/cs/upload2',
        sendData:{
          path: `${this.item.tableName}/${this.item.itemId}/`,
          column: this.item.colname,
          tableName: this.item.tableName
        },
        name: '上传',
        length: (this.item.webconf && this.item.webconf.ImageSize)?this.item.webconf.ImageSize:null,
        width: 120,
        height:120
      },
      http:network
    }
    
   
  }

  mergeMethods() {}

}

export default CustomImageUpload;