<template>
  <div class="extentionObjectCombine">
    <Description :option="option"></Description>
    <div class="content">
      <template v-for="(o, i) in option.objectInfo">
        <div
          class="content"
          v-if="o.type === 'object-group'"
          :key="i"
        >
          <LabelWithObjectGroup
            v-for="(data, dataIndex) in dataArray"
            v-if="dataIndex <= currentIndex"
            :key="dataIndex"
            :object-group-index="dataIndex"
            :data="data"
            :option="o"
            :show-add-button="true"
            :show-minus-button="true"
            @objectGroupItemChange="objectGroupItemChange"
            @addButtonClick="addButtonClick"
            @minusButtonClick="minusButtonClick"
          ></LabelWithObjectGroup>
        </div>
        <LabelWithInput v-if="o.type === 'input'" :item="o" :key="i"></LabelWithInput>
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
      objectGroupItemChange(index, { key, value, belongKey }) {
        console.log(index, { key, value, belongKey });
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
      }
    }
  };
</script>

<style scoped>
  .extentionObjectCombine {
    background-color: green;
  }
</style>
