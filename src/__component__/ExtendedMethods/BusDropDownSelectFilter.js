/** 处理下拉外健公共事件 
 * 
*/
import {
  postData,
  postTableData
} from '../ExtendedAttributes/refcolval.js'
export default class BusDropDownSelectFilterMethod{
  constructor(item, instance){
    this.item = item
    this.instance = instance

    this.postTableData()
    this.postData()
    this.keydown()
  }

  postTableData(){
    let self = this;
    this.instance.methods.postTableData = function (url) {
      // 字段联动 表格数据查询
      return new Promise((resolve) => {
        postTableData.call(this,self,url).then((res)=>{
          resolve(res)
        });
      })
      
    };
  }

  postData(){
    let self = this;
    this.instance.methods.postData = function (url) {
      // 字段联动 模糊查询数据
      return new Promise((resolve) => {
        postData.call(this,self,url).then((res)=>{
          resolve(res)
        });
      })   
    };
  }

  keydown(){
    this.instance.methods['on-keydown'] = function (event) {
      if (event.code === 'Enter') {
        if( this.$parent && this.$parent.$parent && this.$parent.$parent.$parent && this.$parent.$parent.$parent.searchClickData){
          this.$parent.$parent.handleEnter(...arguments);
        }
      }
    };
  }
}