<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />

    <div class="form-group">
      <ExtentionRowItem
        v-for="(group, index) in listConfig"
        :key="index"
        :row-index="index"
        :row-count="listConfig.length"
        :row-label="`按钮${index+1}`"
        is-required
        row-label-class="rowLabel"
        show-operation-button
        :error-tip="rowValidateTips[index]"
        @addRow="addRow"
        @removeRow="removeRow(index)"
      >
        <div class="col">
          <div class="row">
            <Input
              v-model="group.input"
              placeholder="请输入按钮字段名"
              @on-blur="validateKey(index)"
            />
          </div>
          <div
            v-if="inputValidateTips[index]"
            class="tip"
          >
            {{ inputValidateTips[index] }}
          </div>

          <div
            v-if="group.input"
            class="row"
          >
            <div class="col">
              <R3Select
                :options="group.selectConfig"
                @change="getSelect($event, index)"
              />
            </div>
            <div class="col">
              <Input
                v-model="group.value"
                placeholder="对应类型的值"
                @on-blur="validateKey(index)"
              />
            </div>
            <div class="col">
              <Input
                v-model="group.desc"
                placeholder="选填。提示信息"
              />
            </div>
          </div>
        </div>
      </ExtentionRowItem>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import R3Select from '../../select';
  import Description from '../description';
  import ExtentionRowItem from '../extension-row-item';
  import deepClone from '../../../utils/deepClone';
  import { isEmptyObject } from '../../../utils/object';

  const SELECT_OPTIONS = [
    {
      label: '弹框',
      value: 'modal'
    },
    {
      label: '请求',
      value: 'request'
    },
    {
      label: '路由',
      value: 'route'
    }
  ];

  const ITEM_CONSTRUCTOR = {
    input: '',
    selectConfig: {
      placeholder: '触发事件类型',
      defaultValue: '',
      selectOptions: deepClone(SELECT_OPTIONS)
    },
    value: '',
    desc: ''
  };

  export default {
    name: 'OperateColumnButton',

    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: Object,
        default: () => ({})
      },
      showDescription: {
        type: Boolean,
        default: true
      },
    },

    components: {
      Description,
      R3Select,
      ExtentionRowItem
    },

    watch: {
      listConfig: {
        handler(newValue) {
          const newFormData = this.filterForm(newValue);
          if (Object.keys(newFormData).length === 0) {
            this.$emit('dataChange', { key: this.option.key, value: '' });
          } else {
            this.$emit('dataChange', { key: this.option.key, value: newFormData });
          }
        },
        deep: true
      },

      // 清除配置
      defaultData: {
        handler(newData) {
          if (isEmptyObject(newData)) {
            Object.assign(this.$data, this.$options.data.call(this));
          }
        },
        deep: true
      }
    },

    data() {
      return {
        listConfig: [
          deepClone(ITEM_CONSTRUCTOR)
        ],
        inputValidateTips: [],
        rowValidateTips: []
      };
    },

    methods: {
      // 过滤表单
      filterForm(data) {
        const list = deepClone(data);
        if (data.length === 0) {
          return {};
        }

        const formData = {};

        list.forEach((group) => {
          if (group.input && group.selectConfig.defaultValue && group.value) {
            formData[group.input] = {
              type: group.selectConfig.defaultValue,
              value: group.value,
              desc: group.desc
            };
          }
        });

        return formData;
      },

      // 清除整个配置数据
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },

      // 添加行
      addRow() {
        this.listConfig.push(deepClone(ITEM_CONSTRUCTOR));
      },

      // 删除行
      removeRow(rowIndex) {
        this.listConfig.splice(rowIndex, 1);
      },

      // 获取下拉值
      getSelect(e, rowIndex) {
        this.listConfig[rowIndex].selectConfig.defaultValue = e;
        this.validateKey(rowIndex);
      },

      // 校验按钮的key
      validateKey() {
        const validateResults = [];
        const rowValidateResults = [];
        this.listConfig.forEach((row) => {
          // 按钮字段名校验
          if (row.input === '') {
            validateResults.push('请输入按钮字段名');
          } else {
            validateResults.push('');
          }

          // 按钮配置项校验
          if (row.input && (row.value === '' || !row.selectConfig.defaultValue)) {
            rowValidateResults.push('请确认是否填写触发事件类型和对应类型的值');
          } else {
            rowValidateResults.push('');
          }
        });

        this.inputValidateTips = validateResults;
        this.rowValidateTips = rowValidateResults;
      },

      init() {
        const defaultData = deepClone(this.defaultData);
        if (Object.keys(defaultData).length === 0) {
          return;
        }

        const list = [];
        Object.keys(defaultData).forEach((key) => {
          const item = defaultData[key];
          list.push({
            input: key,
            selectConfig: {
              placeholder: '触发事件类型',
              defaultValue: item.type,
              selectOptions: deepClone(SELECT_OPTIONS)
            },
            value: item.value,
            desc: item.desc
          });
        });
        this.listConfig = list;
      }
    },

    created() {
      this.init();
    }
  };
</script>

<style lang="scss" scoped>
.form-group {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 20px 5px;
}

.tip {
  margin-top: 10px;
  color: red;
}
</style>

<style lang="scss">
.form-group {
  .rowLabel {
    flex: 60px 0 0;
  }
}
</style>
