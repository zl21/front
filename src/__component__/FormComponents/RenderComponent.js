/* eslint-disable class-methods-use-this */

import Vue from 'vue';
import ItemComponent from '../ItemComponent.vue';

String.prototype.TextFilter = function TextFilter() {
  const pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,+。.、]"); // []内输入你要过滤的字符
  let rs = '';
  for (let i = 0; i < this.length; i++) {
    rs += this.substr(i, 1).replace(pattern, '');
  }
  return rs;
};

export default class RenderComponent {
  constructor(item, id) {
    // 初始化对象的语句
    this.id = id;
    this.item = item;
  }


  Initialize() {
    Vue.component(`${this.id}${this.item.field.TextFilter()}`, Vue.extend(ItemComponent));
    return `${this.id}${this.item.field.TextFilter()}`;
  }
}
