<template>
  <div>
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />
    <div class="tw-mt-20 form-group">
      <div
        class="row tw-mt-20"
        v-for="(component, index) in option.components"
        :key="index"
      >
        <div class="label-column">
          <p>{{ component.name }}</p>
          <p>[{{ component.key }}]：</p>
        </div>
        <div class="item-column">
          <div class="item-row tw-flex-grow tw-flex">
            <Input
              v-model="formData[component.key]"
              v-if="component.type === 'input'"
              v-input-number:[component.inputType]
              :placeholder="component.placeholder"
              @input="inputChange($event, component.key)"
            />

            <Select
              v-if="component.type === 'select'"
              clearable
              @on-change="selectChange($event, component.key)"
            >
              <Option
                v-for="item in component.selectOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>

            <AKRadio
              v-if="component.type === 'radio'"
              :options="component.options"
              @change="radioChange($event, component.key)"
            ></AKRadio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Description from './description';
import AKRadio from '../radio';
import deepClone from '../../utils/deepClone';
import inputNumber from '../../directive/inputNumber'
import '../../assets/tailwindcss/index.css'

export default {
  name: 'ObjectValue',

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
    AKRadio
  },

  data() {
    return {
      formData: null,
    };
  },

  methods: {
    // 清除整个配置数据
    removeOption(keyArray) {
      this.initData() // 这里不传参数，以此清空formData
      this.$emit('removeOption', keyArray || []);
    },

    // 初始化数据
    initData(defaultData) {
      if (typeof defaultData === 'object') {
        this.formData = deepClone(defaultData);

        this.option.components.forEach(component => {
          // 设置radio默认值
          if (component.type === 'radio') {
            const option = component.options.selectOptions.find(item => item.value === defaultData[component.key])
            component.options.defaultValue = option.label
          }
        })
      } else {
        const obj = {};
        this.option.components.forEach(component => {
          obj[component.key] = component.defaultValue

          if (component.type === 'radio') {
            component.options = deepClone(component.options)
          }
        })
        this.formData = obj
      }
    },

    // input变化
    inputChange(e, key) {
      this.formData[key] = e
      this.valueChange()
    },

    // radio变化
    radioChange(e, key) {
      this.formData[key] = e.value
      this.valueChange()
    },

    // select变化
    selectChange(e, key) {
      this.formData[key] = e.value
      this.valueChange()
    },

    // 给父组件传值
    valueChange(value) {
      let clearConfig = false
      this.option.components.forEach(component => {
        if (component.isClearConfig && component.canClear(this.formData)) { // 如果字段值不存在，就清空整个配置对象
          clearConfig = true
        } else if (component.canClear(this.formData)) { // 如果字段值不存在，就从配置对象里删除这个key。(JSON序列化会过滤掉undefined)
          this.formData[component.key] = undefined
        }
      })

      // 去掉没值的字段
      if (Object.keys(JSON.parse(JSON.stringify(this.formData))).length === 0 || clearConfig) {
        this.$emit('dataChange', { key: this.option.key, value: '' });
      } else {
        this.$emit('dataChange', { key: this.option.key, value: this.formData });
      }
    }
  },

  created() {
    this.initData(this.defaultData);
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
