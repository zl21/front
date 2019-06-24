<template>
  <div class="extentionObjectCombine">
    <Description :option="option" />
    <div class="content">
      <template v-for="(o, i) in option.objectInfo">
        <div
          v-if="o.type === 'object-group'"
          :key="i"
          class="content"
        >
          <div
            v-for="(data, index) in dataArray"
            :key="index"
            class="content"
          >
            <LabelWithObjectGroup
              v-if="index <= currentIndex"
              :key="index"
              :object-group-index="index"
              :default-data="defaultData[o.key][index]"
              :data="data"
              :option="o"
              :show-add-button="currentIndex === index && currentIndex !== 9"
              :show-minus-button="currentIndex === index && currentIndex !== 0"
              @objectGroupItemChange="objectGroupItemChange"
              @addButtonClick="addButtonClick"
              @minusButtonClick="minusButtonClick"
            />
          </div>
        </div>
        <LabelWithInput
          v-if="o.type === 'input'"
          :key="i"
          :belong-key="option.key"
          :item="o"
          :default-data="defaultData[o.key]"
          @inputValueChange="inputValueChange"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithObjectGroup from './LabelWithObjectGroup';
  import LabelWithInput from './LabelWithInput';

  const generateObjectArray = (length) => {
    const temp = [];
    if (length <= 0) { return []; }
    for (let i = 0; i < length; i++) {
      temp.push({});
    }
    return temp;
  };

  export default {
    name: 'ExtentionObjectCombine',
    components: {
      Description,
      LabelWithObjectGroup,
      LabelWithInput
    },
    data() {
      return {
        currentIndex: 0,
        dataArray: generateObjectArray(10),
      };
    },
    methods: {
      cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      objectGroupItemChange(index, { key, value, belongKey }) {
        const copyData = this.cloneObject(this.defaultData[belongKey] ? this.defaultData[belongKey] || [] : []);
        if (value === '') {
          if (copyData[index] && copyData[index][key] !== undefined) {
            delete copyData[index][key];
          }
        } else {
          copyData[index] = Object.assign({}, copyData[index], { [key]: value });
        }
        this.$emit('rootDataChange', { key: this.option.key, value: Object.assign({}, Object.assign({}, this.defaultData, { [belongKey]: copyData })) });
      },
      addButtonClick() {
        if (this.currentIndex >= 9) { return; }
        this.currentIndex = this.currentIndex + 1;
      },
      minusButtonClick({ belongKey }) {
        if (this.currentIndex <= 0) { return; }
        this.currentIndex = this.currentIndex - 1;
        const copyData = this.cloneObject(this.defaultData[belongKey] ? this.defaultData[belongKey] || [] : []);
        copyData.pop();
        this.$emit('rootDataChange', { key: this.option.key, value: Object.assign({}, Object.assign({}, this.defaultData, { [belongKey]: copyData })) });
      },
      inputValueChange({ key, value }) {
        let copyData = this.cloneObject(this.defaultData || {});
        if (value === '') {
          delete copyData[key];
        } else {
          copyData = Object.assign({}, copyData, { [key]: value });
        }
        this.$emit('rootDataChange', { key: this.option.key, value: copyData });
      }
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: Object,
        default: () => ({})
      },
    },
    created() {
      const key = this.option.objectInfo.filter(d => d.type === 'object-group')[0].key;
      this.dataArray = this.dataArray.map((d, i) => d || this.defaultData[key][i]);
      this.currentIndex = this.defaultData[key].length - 1;
    }
  };
</script>

<style scoped>
</style>
