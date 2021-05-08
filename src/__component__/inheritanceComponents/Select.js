/**
 * select组件的自定义逻辑处理
 */
import Vue from 'vue';

import { SetPlaceholder ,SetDisable} from './setProps';


let Select = Ark.Select
// 深拷贝

class CustomSelect {
  constructor(item) {
    this.item = item;
    this.Vm = Select;
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
   
    this.settingOptions();
    this.props = {
      transfer:true,
      multiple:!this.item.detailType,
      clearable:true,
      chooseAll:true,
      options:this.item.props.options,
      placeholder:new SetPlaceholder(this.item).init(),
      disabled:new SetDisable(this.item).init(),
    }
   
  }

  // 合并methods
  mergeMethods() {


  }

  
  settingOptions() {
    if(!this.item.props){
      this.item.props = {}
    }
    if (this.item.combobox) {
      this.item.props.options = this.item.combobox.map((item) => {
        item.value = item.limitval;
        item.label = item.limitdesc;
        return item;
      });
    }

    // 合并类型字段
    if (this.item.conds) {
      const arr = [];
      this.item.conds.map((item) => {
        item.combobox.map((temp) => {
          temp.value = `${item.colname}|${temp.limitval}`;
          temp.label = temp.limitdesc;
          arr.push(temp);
          return temp;
        });
        return item;
      });

      this.item.props.options = arr;
    }
  }
}

export default CustomSelect;
