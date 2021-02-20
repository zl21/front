/**
   *处理表单数据格式
   *
   * @returns
   * @memberof ParameterDataProcessing
   * 
   * @field 字段名
   * @value 需要处理的数据值
   */

export default class ParameterDataProcessing {
  constructor(item, value) {
    this.item = item;
    this.value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  /**
   *处理表单抛出去的传参数据格式
   *
   * @returns
   * @memberof dataProcessing
   */
  dataProcessing() { 
    // eslint-disable-next-line func-names
    const Type = (function () {
      const Type = {};
      // eslint-disable-next-line no-cond-assign
      for (let i = 0, type; type = ['Undefined', 'Null', 'Boolean', 'Number', 'String', 'Function', 'Array', 'Object'][i++];) {
        // eslint-disable-next-line func-names
        (function (type) {
          // eslint-disable-next-line func-names
          Type[`is${type}`] = function (obj) {
            return Object.prototype.toString.call(obj) === `[object ${type}]`;
          };
        }(type));
      }
      return Type;
    }());

    if (!this.value) { // 过滤空数据字段
      return {
        [this.item.field]: this.value
      };
    }

    // 处理空数组和存在值为''的数据
    if (Type.isArray(this.value) && (this.value.length === 0 || this.value.includes(''))) {
      return {};
    }

    // 处理select合并字段
    if (Type.isArray(this.value) && this.item.field.includes('R3_index_')) {
      const obj = this.value.reduce((json, item) => {
        if (json[item.split('|')[0]]) {
          json[item.split('|')[0]].push(item.split('|')[1]);
        } else {
          json[item.split('|')[0]] = [item.split('|')[1]];
        }
        
        return json;
      }, {});
      return obj;
    }

    // 处理外健关联字段
    if (Type.isArray(this.value) && this.item.type === 'DropDownSelectFilter') {
      return {
        [this.item.field]: this.value.map(item => item.ID)
      };
    }
    return {
      [this.item.field]: this.value
    };
  }
}
