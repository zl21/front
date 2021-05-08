/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * DocUpload组件自定义
 */

 import Vue from 'vue';
 import { Docfile } from '@syman/ark-ui-bcl';
 import network, { getGateway } from '../../__utils__/network';
//  import Docfile from 'arkui_BCL/Docfile';

import { SetPlaceholder ,SetDisable} from './setProps';

 
 class CustomDocUpload {
  constructor(item) {
    this.item = item;
    this.Vm = Docfile;
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
    this.props={
      accept:this.item.webconf && this.item.webconf.UploadAccept || '*',
      itemWebconf:this.item.webconf || {},
      webConfSingle:this.item.webConfSingle || {},
      http:network,
      dataitem:{
        readonly: new SetDisable(this.item).init(), //控制字段是否可编辑
        url: getGateway('/p/cs/batchUpload'),
        filesLength:this.item.webconf && this.item.webconf.filesLength ? this.item.webconf.filesLength : null,
        filesize:this.item.webconf && this.item.webconf.filesize ? parseFloat(this.item.webconf.filesize*1024*1024) : null,
        accept: this.item.webconf && this.item.webconf.UploadAccept ? this.item.webconf.UploadAccept : null,
        sendData:{
          path: `${this.item.tableName}/${this.item.itemId}/`,
        },

      }
    } 
   
    
   }
 
 
 
 }
 
 export default CustomDocUpload;