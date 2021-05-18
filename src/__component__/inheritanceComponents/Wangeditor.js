/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * ImageUpload组件自定义
 */

import { Wangeditor } from '@syman/ark-ui-bcl';
// import Wangeditor from 'arkui_BCL/Wangeditor';
import network from '../../__utils__/network';
import { SetPlaceholder ,SetDisable} from './setProps';


class CustomWangeditor {
  constructor(item) {
    this.item = item;
    this.Vm = Wangeditor;
    this.mergeProps();   
    // this.mergeMethods(); 
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
      tabAction:false,
      placeholder:new SetPlaceholder(this.item).init(),
      isActives:new SetDisable(this.item).init(),
      http:network
    }
  }



}

export default CustomWangeditor;