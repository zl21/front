<template>
  <div class="extentionObjectGroup">
    <Description
      :option="option" v-if="showDescription"
      @removeOption="removeOption"
    />
    <div class="content-row">
      <div class="left" v-if="option.showLabel">
        <label>{{ option.name }}</label>
        <label>{{ option.key }}</label>
      </div>
      <div class="right">
        <div
          v-for="(data, index) in dataArray"
          :key="index"
          class="content"
        >
          <ObjectGroupItem
            v-if="index <= currentIndex"
            :object-group-index="index"
            :default-data="defaultData[index] || {}"
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
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import ObjectGroupItem from './ObjectGroupItem';

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
      ObjectGroupItem,
    },
    methods: {
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },
      objectGroupItemChange(index, { key, value }) {
        let copyData = JSON.parse(JSON.stringify(this.defaultData || []));
        if (value === '') {
          if (copyData[index] && copyData[index][key] !== undefined) {
            delete copyData[index][key];
            if (copyData.length === 1 && index === 0 && JSON.stringify(copyData[index]) === '{}') {
              copyData.splice(index, 1);
            }
          }
        } else {
          copyData[index] = Object.assign({}, copyData[index], { [key]: value });
        }
        copyData = JSON.parse(JSON.stringify(copyData)).map(d => d || {});
        this.$emit('dataChange', { key: this.option.key, value: copyData.length === 0 ? '' : copyData }, index);
      },
      addButtonClick() {
        if (this.currentIndex >= 9) { return; }
        this.currentIndex = this.currentIndex + 1;
      },
      minusButtonClick() {
        if (this.currentIndex <= 0) { return; }
        this.currentIndex = this.currentIndex - 1;
        const copyData = JSON.parse(JSON.stringify(this.defaultData || []));
        copyData.pop();
        this.$emit('dataChange', { key: this.option.key, value: copyData });
      }
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
        type: [Array],
        default: () => []
      },
    },
    created() {
      this.dataArray = this.dataArray.map((d, i) => d || this.defaultData[i]);
      this.currentIndex = this.defaultData.length - 1 >= 0 ? this.defaultData.length - 1 : 0;
    }
  };
</script>
