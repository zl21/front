import {
  FindInstance
} from './common.js';

/*
$this 目标实例
config  webcof 的配置
*/
// 联动计算
export const dynamicforcompute = function dynamicforcompute($this, config) {
  // 服务端赋值
  let panelForm = document.querySelector(`#${$this.items.formName}`)._vue_;
  if(!panelForm){
      return false;
  }

  let FormData = panelForm.getFormData();
  let str = '';

  FormData.then((res) => {
    let data = res;
    str = config.refcolumns.reduce(
      (temp, current) => {
        temp = temp.replace(new RegExp(current, 'g'), ((Number(data[current]) * 1000) / 1000));
        return temp;
      },
      config.express
    );
    let DyNvalue = '';
    if (!eval(str) && eval(str) !== 0) {
      DyNvalue = '';
    } else if (eval(str) === 0) {
      DyNvalue = 0;
    } else {
      const scale = $this.items.scale;
      DyNvalue = eval(str).toFixed(scale);
    }

    let targetVm = FindInstance($this, config.computecolumn, $this.items.tableName);
    if (targetVm[0]) {
      targetVm[0].value = DyNvalue;
    }
  });




};