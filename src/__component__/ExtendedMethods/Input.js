/** 处理input公共事件 
 * 
*/
export default class InputMethod{
  constructor(item, instance){
    this.item = item
    this.Input = instance

    if(!this.item.detailType){
      this.handleEnter()
    }

  }

  handleEnter(){
    const handleEnter = this.Input.methods.handleEnter;
      
    this.Input.methods.handleEnter = function () {
      handleEnter.call(this, ...arguments);
      if( this.$parent && this.$parent.$parent && this.$parent.$parent.$parent && this.$parent.$parent.$parent.searchClickData){
        this.$parent.$parent.handleEnter(...arguments);
      }
      
    };
  }
}