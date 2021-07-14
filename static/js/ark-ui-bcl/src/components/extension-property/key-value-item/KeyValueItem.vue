<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />
    <template v-for="(component, index) in option.components">
      <div
        class="tw-mt-20 form-group"
        :key="index"
        v-if="!component.isShow || (component.isShow && component.isShow(formData))"
      >
        <div class="row tw-mt-20">
          <div class="label-column">
            <p>{{ component.name }}</p>
            <p>[{{ component.key }}]：</p>
          </div>
          <div class="item-column">
            <div class="item-row tw-flex-grow tw-flex">
              <Input
                v-if="component.type === 'input'"
                v-model="formData[component.key]"
                v-input-number:[component.inputType]
                :placeholder="component.placeholder"
                @input="valueChange($event, index)"
              />
              <Select
                v-if="component.type === 'select'"
                v-model="formData[component.key]"
                clearable
                @on-change="valueChange($event, index)"
              >
                <Option
                  v-for="item in component.selectOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
import Description from '../description';
import deepClone from '../../../utils/deepClone';
import inputNumber from '../../../directive/inputNumber'
import '../../../assets/tailwindcss/index.css'

export default {
  name: 'KeyValueItem',

  directives: {inputNumber},

  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    defaultData: {
      type: [String, Object, Array],
      default: ''
    },
    showDescription: {
      type: Boolean,
      default: true
    },
  },

  components: {
    Description,
  },

  data() {
    return {
      formData: {},
    };
  },

  methods: {
    // 清除整个配置数据
    removeOption(keyArray) {
      Object.assign(this.$data, this.$options.data.call(this));
      this.option.components.forEach(component => {
        this.$emit('dataChange', { key: component.key, value: '' });
      })
    },

    // 初始化数据
    initData() {
      this.option.components.forEach(component => {
        this.formData[component.key] = undefined;
      })
      if (typeof this.defaultData === 'object') {
        this.formData = deepClone(this.defaultData);
      }
    },

    clearHiddenComponent() {
      // 清空隐藏组件的值
      this.option.components.forEach(component => {
        if(component.isShow && !component.isShow(this.formData)) {
          this.formData[component.key] = undefined;
          this.$emit('dataChange', { key: component.key, value: '' });
        }
      })
    },

    // input, select变化
    valueChange(value, index) {
      this.clearHiddenComponent();
      if (!value) {
        this.$emit('dataChange', { key: this.option.components[index].key, value: '' });
      } else {
        this.$emit('dataChange', { key: this.option.components[index].key, value });
      }
    }
  },

  created() {
    this.initData();
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin: 20px 5px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    margin-top: 0px;
  }
  .col {
    flex: 1;
    margin-right: 5px;
  }

  .row-title {
    flex: 50px 0 0;
  }
}

.label-column {
  display: flex;
  flex: 0 1 150px;
  justify-content: center;
  text-align: right;
  flex-direction: column;
  margin-right: 10px;
  line-height: 18px;
}

.item-column {
  display: flex;
  flex: 1;
  align-items: center;
}
</style>
