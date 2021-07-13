/* eslint-disable func-names */
<template>
  <div class="ExtentionOptions">
    <Description
      v-if="showDescription"
      :option="option"
      @removeOption="removeOption"
    />
    <!-- 条件字段 -->
    <div class="content">
      <LabelWithInput
        :item="clonameOptions"
        :default-data="defaultData.colnames"
        @inputValueChange="inputValueChange"
        @inputBlur="inputBlur"
      />
    </div>

    <!-- 规则配置 -->
    <div
      v-for="(item,i) in defaultData.rules"
      :key="i"
      class="itme"
    >
      <p
        v-for="(temp,j) in defaultData.colnames.split(',')"
        :key="j"
        class="colnameItem"
      >
        <span>{{ temp }}</span>
      </p>
    </div>
  </div>
</template>
<script>
  import Description from './description';
  import LabelWithInput from './LabelWithInput';

  export default {
    name: 'ExtentionOptions',
    components: {
      Description,
      LabelWithInput
    },
    props: {
      showDescription: {
        type: Boolean,
        default: true
      },
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [Object],
        default: () => ({
          colnames: '',
          rules: []
        })
      },
    },
    data() {
      return {
        clonameOptions: { // 条件字段配置
          name: '条件字段',
          key: 'colnames',
          type: 'input',
          description: '控制列表操作列按钮的字段',
        },
        clonameChange: false, // 判断条件字段是否改变，失去焦点时候需要
      };
    },
    watch: {
      // eslint-disable-next-line func-names
      'defaultData.colnames': function (val, old) {
        if (val !== old && !val) {
          this.clonameChange = true;
        } else {
          this.clonameChange = false;
        }
      }
    },
    methods: {
      removeOption() {
        this.$emit('removeOption', {});
      },
      inputBlur() { // 条件字段失去焦点
        if (this.clonameChange) {
          this.$Modal.warning({
            title: '警告',
            content: '更改条件字段后，已配置的规则配置表内容将会被清空，是否继续该操作？',
            mask: true,
            onOk: () => {
              const key = 'rules';
              const value = [];
              this.$emit('dataChange', { key: this.option.key, value: Object.assign(this.defaultData[this.option.key] || {}, { [key]: value }) });
            }
          });
        }

        // 存在条件字段时，增加一个默认规则
        if (this.defaultData.colnames && (!this.defaultData.rules || this.defaultData.rules.length === 0)) {
          const obj = {
            jsonValue: {},
            buttons: []
          };
          this.defaultData.colnames.split(',').map((item) => {
            obj.jsonValue[item] = null;
            return item;
          });
          this.$set(this.defaultData.rules, 0, obj);
          this.$emit('dataChange', { key: this.option.key, value: JSON.parse(JSON.stringify(this.defaultData)) });
        }
      },
      inputValueChange({ key, value }) { // 条件字段的修改
        if (value === '') {
          // 清除所有的
          const cloneRootData = JSON.parse(JSON.stringify(this.defaultData));
          delete cloneRootData[this.option.key][key];
          this.$emit('dataChange', { key: this.option.key, value: JSON.stringify(cloneRootData[this.option.key]) === '{}' ? '' : cloneRootData[this.option.key] });
        } else {
          const cloneRootData = JSON.parse(JSON.stringify(this.defaultData));
          cloneRootData[key] = value;
          this.$emit('dataChange', { key: this.option.key, value: cloneRootData });
        }
      }
    }
  };
</script>
<style lang="less" scoped>
.ExtentionOptions{
  .content{
    border-bottom: 1px solid #999;
  }
}
</style>
