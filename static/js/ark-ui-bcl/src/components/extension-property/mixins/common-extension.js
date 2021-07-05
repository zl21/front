import Description from '../description'
import ExtentionRowItem from '../extension-row-item'
import deepClone from '../../../utils/deepClone';
import { urlSearchParams } from '../../../utils/http';

export default {
  inject: ['network'],

  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
    defaultData: {},
    keyForm: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      dropList: {},
      searchList: [],
      totalCount: 0,
      pageSize: 10,
      columnsKey: ['DBNAME'],
      hidecolumns: ['ID'], // 隐藏输入时下拉搜索结果列// 用类数组存默认值
    }
  },

  components: {
    Description,
    ExtentionRowItem,
  },

  methods: {
    // 添加行
    addRow(targetArr, element) {
      targetArr.push(deepClone(element));
    },

    // 减少行
    removeRow(targetArr, rowIndex) {
      targetArr.splice(rowIndex, 1);;
    },

    // 清空配置项
    removeOption(keyArray) {
      // 清楚整个配置数据
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('removeOption', keyArray || [])
    },

    commonApi(api, searchdata, options) {
      const { hideColumns, displayKeys } = options;
      return new Promise((resolve) => {
        this.network
          .post(api, urlSearchParams(searchdata))
          .then((res) => {
            if (res.data.code === 0) {
              const tabth = res.data.data.tabth;
              const row = res.data.data.row;

              for (let i = Math.max(tabth.length - 1, 0); i >= 0; i--) {
                const item = tabth[i];
                // 让输入框显示 表名称 字段
                if (displayKeys.includes(item.name)) {
                  item.isak = true;
                } else {
                  item.isak = false;
                }

                // 隐藏table列
                if (hideColumns.includes(item.colname)) {
                  tabth.splice(i, 1);
                }
              }

              if (hideColumns.length > 0) {
                row.forEach((item) => {
                  for (const key in item) {
                    // 隐藏模糊结果列
                    if (hideColumns.includes(key)) {
                      delete item[key];
                    }
                  }
                });
              }

              resolve(res.data.data);
            } else {
              resolve({});
            }
          }).catch(() => {
            resolve({});
          });
      });
    },

    // 选择模糊查询的数据
    // data返回数据;target需要被修改的数据;field被修改数据的字段;key取返回值里的哪个key
    selectValue(data, target, field, key) {
      this.$set(target, field, data[0][key])
    },

    // 清除选择的表名
    clearValue(target, field) {
      this.$set(target, field, '')
    },
  },
}
