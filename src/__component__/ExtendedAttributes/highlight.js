/** 处理单对象字段间的高亮关系
 *  LinkageRelationships
 *  @param 表单数据  type： $current 当前实例  config 配置
 *  @return 重构后的数据 type: Array
 */
export const highLight = function ($current, config) {
  let {
    highlight
  } = config;
  let {
    rules
  } = highlight;

 
  if (highlight.scope !== 'table') {
    
    if(highlight.label){
      checkLabelRules(highlight.labelStyle, $current, 'label');      
    }
    if($current.items.fkdisplay){
      // 外键字段回避
      return;
    }
    if(highlight.value){
      checkValueRules(rules, $current, 'value');      
    }
  }
};

/** 处理 高亮的规则
 *  LinkageRelationships
 *  @param 表单数据  type： $current 当前实例  config 配置
 *  @return 重构后的数据 type: Array
 */

// export const checkAllRules = function (rules, $current, type) {
//   $current.setlabelStyle = rules;
//   setDomStyle(style, $current.$el, $current.items);

// };

export const checkValueRules = function (rules, $current, type) {
  let style = EachRules(rules, $current.value, type,$current.items.type);
  setDomStyle(style, $current.$el, $current.items);
};
export const checkLabelRules = function (rules, $current) {
  let style = rules;
  $current.setlabelStyle = style;
};
/** 处理 高亮的规则
 *  LinkageRelationships
 *  @param 表单数据  type：rules 比较的规则 value 比较的值 type 类型
 *  @return 重构后的数据 type: object
 */
export const EachRules = function (rules, value, type,display) {
  let style;
  rules.some((x) => {
    try {
      let operator = new Function('v', `return ${x.operator.replace(/undefined/,'')}`);
      if(Array.isArray(value) && value[0]){
        if(value[0].ID){
          value = value.reduce((arr,item)=>{
              arr.push(item.ID);
              return arr;
          },[]).join('');
        }

      }else{
       if(value === undefined){
          value = '';
       }

      }
      if(display ==='NUMBER'){
        if((value ==='' || value ===null)){
          return false
        }else {
          value = Number(value);
          
        }

      }
      if (operator(value)) {
        style = x.style;
        return;
      }
     
    } catch (error) {
      console.log(error);
    }
  });

  if (style && type != 'label') {
    let data = Object.keys(style).reduce((arr, item) => {
      if (style[item] && ['normal', 'none'].includes(style[item]) !== true) {
        arr[item] = style[item];
      }
      return arr;
    }, {});
    style = data;
  }
  return style;
};
/** 处理 驼峰名称转小写
 *  LinkageRelationships
 *  @param 表单数据  name 驼峰名称
 *  @return 重构后的数据 type: string
 */
function toHump(name) {
  return name.replace(/([A-Z])/g, function (all, letter) {
    return '-' + letter.toLowerCase();
  });
}
/** 处理 dom 渲染style 文件
 *  LinkageRelationships
 *  @param 表单数据  style 样式 ,$el 父级dom ,items 数据判断
 *  @return 重构后的数据 type: string
 */
function setDomStyle(style, $el, items) {
  let {
    display
  } = items;
  let dom = '';
  switch (display) {
    case 'OBJ_SELECT':
      dom = $el.querySelector('.ark-select-selection');
      break;
    default:
      dom = $el.querySelector('.ark-input-default');
      break;
  }

  if (dom) {
    dom.style.cssText = '';
    if (!style) {
      return;
    }
    dom.style.cssText = Object.keys(style).reduce((arr, item) => {
      let key = toHump(item);
      arr = `${key}:${style[item]};` + arr;
      return arr;
    }, '');

  }
}