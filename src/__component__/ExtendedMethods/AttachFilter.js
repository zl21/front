/** 处理AttachFilter公共事件 
 * 
*/
export default class AttachFilterMethod{
  constructor(item, instance){
    this.item = item
    this.AttachFilter = instance

    this.valueChange()
    this.attachFilterInputKeydown()

  }

   // 重写valueChange事件,给父节点的value复制，实现双向数据绑定效果
  valueChange(){
    const _self = this;
    this.AttachFilter.methods.valueChange = function (type) { // 重写valueChange事件,给父节点的value复制，实现双向数据绑定效果
      window.clearTimeout(this.clickTimer);
      this.clickTimer = window.setTimeout(() => {
        if (type === 'clear') {
          this.$emit('valuechange', { value: null, selected: [], type }, this);
          this.$parent.value = [];
        } else {
          // 处理弹窗单选数据
          // eslint-disable-next-line no-nested-ternary
          this.$emit('valuechange', { value: this.PropsData.fkdisplay === 'pop' ? ((this.selected && this.selected.length > 0) ? this.selected[0].ID : '') : this.value, selected: this.selected, type }, this);
          this.$parent.value = this.selected;
        }
      }, 200);
    };
  }

  // 回车查询
  attachFilterInputKeydown(){
    const attachFilterInputKeydown = this.AttachFilter.methods.attachFilterInputKeydown;
    this.AttachFilter.methods.attachFilterInputKeydown = function () {
      attachFilterInputKeydown.call(this, ...arguments);
      if (arguments[1].code === 'Enter') {
        setTimeout(() => {
          this.$parent.$parent.handleEnter(...arguments);
        }, 300);
      }
    };
  }
}