/**
/**
 * Switch组件的自定义逻辑处理
 */
 import { SetDisable } from './setProps';


 let Switch = Ark.Switch
 
 class CustomSwitch {
   constructor(item) {
     this.item = item;
     this.Vm = Object.create(Switch);
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
       trueValue:this.item.trueValue,
       falseValue:this.item.falseValue,
       size:'small',
       disabled:new SetDisable(this.item).init(),
     }
   }
 
   // 合并methods
   mergeMethods() {
 
   }
 
 
   settingOptions() {
     if (this.item.combobox) {
       this.item.combobox.map((item) => {
         if(item.limitdis){
           this.item.trueValue = item.limitval
         }else{
           this.item.falseValue = item.limitval
         }
         return item;
       });
     }
 
   }
 }
 
 export default CustomSwitch;
 