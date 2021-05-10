/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * EnumerableInput读写规则组件自定义
 */

import { EnumerableInput } from '@syman/ark-ui-bcl';
import { SetPlaceholder ,SetDisable} from './setProps';


class CustomEnumerableInput{
  constructor(item) {
    this.item = item;
    this.Vm = Object.create(EnumerableInput);
    this.mergeProps();   
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
        disabled:new SetDisable(this.item).init(),
        tableName:this.item.tableName
      }
  }


  mergeMethods() {}
}

export default CustomEnumerableInput;