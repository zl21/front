<template>
  <div class="extentionObjectGroup">
    <Description :option="option" />
    <div
      v-for="(data, index) in dataArray"
      :key="index"
      class="content"
    >
      <LabelWithObjectGroup
        v-if="index <= currentIndex"
        :object-group-index="index"
        :default-data="defaultData[index]"
        :data="data"
        :option="option"
        :show-add-button="currentIndex === index && currentIndex !== 9"
        :show-minus-button="currentIndex === index && currentIndex !== 0"
        @objectGroupItemChange="objectGroupItemChange"
        @addButtonClick="addButtonClick"
        @minusButtonClick="minusButtonClick"
      />
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import LabelWithObjectGroup from './LabelWithObjectGroup';
  
  const generateObjectArray = (length) => {
    const temp = [];
    if (length <= 0) { return []; }
    for (let i = 0; i < length; i++) {
      temp.push({});
    }
    return temp;
  };
  
  export default {
    name: 'ExtentionObjectGroup',
    data() {
      return {
        currentIndex: 0,
        dataArray: generateObjectArray(10),
      };
    },
    components: {
      Description,
      LabelWithObjectGroup,
    },
    methods: {
      objectGroupItemChange(index, { key, value }) {
        const copyData = JSON.parse(JSON.stringify(this.rootData[this.option.key] || []));
        if (value === '') {
          if (copyData[index] && copyData[index][key]) {
            delete copyData[index][key];
          }
        } else {
          copyData[index] = Object.assign({}, copyData[index], { [key]: value });
        }
        this.$emit('rootDataChange', { key: this.option.key, value: copyData });
      },
      addButtonClick() {
        if (this.currentIndex >= 9) { return; }
        this.currentIndex = this.currentIndex + 1;
      },
      minusButtonClick() {
        if (this.currentIndex <= 0) { return; }
        this.currentIndex = this.currentIndex - 1;
        const copyData = JSON.parse(JSON.stringify(this.rootData[this.option.key] || []));
        copyData.pop();
        this.$emit('rootDataChange', { key: this.option.key, value: copyData });
      }
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [Array],
        default: () => []
      },
    },
    created() {
      this.dataArray = this.dataArray.map((d, i) => d || this.defaultData[i]);
      this.currentIndex = this.defaultData.length - 1;
    }
  };
</script>

<style scoped>
  .extentionObjectGroup {
    display: flex;
    flex-direction: column;
  }
</style>
