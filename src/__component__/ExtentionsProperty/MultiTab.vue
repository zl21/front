<template>
  <div class="MultiTab">
    <Description
      :option="option"
      @removeOption="removeOption"
    />

    <div
      v-for="(item,index) in Object.keys(sumTabs)"
      :key="index"
      class="tabContent"
    >
      <p class="label-input">
        <span>标签名:</span>
        <Input v-model="sumTabs[item].tab_name" />
      </p>

      <!-- blank -->
      <p class="blank" />

      <div 
        v-for="(temp,j) in sumTabs[item].tab_value"
        :key="j"
        class="colnameContent"
      >
        <div class="colname">
          <p>关联字段:</p>
          <div>
            <DropMultiSelectFilter />
          </div>
        </div>
        <div class="operator">
          <p>运算符:</p>
          <Select />
        </div>
        <div class="contrastValue">
          <p>对比值:</p>
          <Input v-model="temp.contrast_value" />
        </div>

        <!-- 增加字段按钮 -->
        <div class="oprate">
          <p />
          <button
            class="operate-button"
            @click="(event) => {sumTabs[item].tab_value = addColname(sumTabs[item].tab_value)}"
          >
            +
          </button>
          <button
            class="operate-button"
            @click="(event) => {sumTabs[item].tab_value = deleteColname(sumTabs[item].tab_value,j)}"
          >
            -
          </button>
        </div>
      </div>


      <!-- 增加tab按钮 -->
      <button
        v-if="!currentDataIsEmpty"
        class="operate-button"
        @click="addButtonClick"
      >
        +
      </button>
    </div>
  </div>
</template>
<script>
  import Description from './Description.vue';

  export default {
    components: { Description },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        currentData: {}, // 当前配置修改数据
        sumTabs: {
          0: {
            tab_name: null,
            tab_value: [
              {
                col_name: '',
                operator: '',
                contrast_value: ''
              }
            ]
          }
        }, // 所有的tab配置
      };
    },
    computed: {
      currentDataIsEmpty() {
        return JSON.stringify(this.currentData) === '{}';
      }
    },
    methods: {
      removeOption(keyArray) { // 清楚整个配置数据
        this.$emit('removeOption', keyArray || []);
      },
      addButtonClick() { // 新增tab配置

      },
      addColname(item) { // 新增字段配置
        /*
          入参: 
            item:  //当前tab的字段配置数组  type array
          出参:
            修改后的tab配置
        */
        item.push({
          col_name: '',
          operator: '',
          contrast_value: ''
        });
        return item;
      },
      deleteColname(item, index) { // 删除字段配置
        /*
          入参: 
            item:  //当前tab的字段配置数组  type:Array
            index:  //需要删除的配置下标 type:number
          出参:
            修改后的tab配置
        */ 
        item = item.filter((temp, j) => index !== j);
        return item;
      }
    }
  };
</script>
<style lang="less" scoped>
.MultiTab{
  .tabContent{
    border: 1px solid #d3d3d3;
    padding: 10px;
    position: relative;

    .label-input{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      

      >span{
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }

    .blank{
      position: absolute;
      width: 100%;
      height: 1px;
      background: #d3d3d3;
      left: 0;
    }

    .colnameContent{
      display: flex;
      padding-top: 10px;

      >div{
        flex: 1;
        margin-right: 10px;

        >p{
          height: 12px;
          margin-bottom: 4px;
        }

        &.colname{
          flex: 2;
        }

        &.oprate{
          width: 50px;
          flex: none;
        }

        &:last-child{
          margin: 0;
        }
      }
    }
  }

  .operate-button {
    background-color: transparent;
    outline: none;
    font-size: 16px;
    padding: 5px;
    border: 1px solid lightgrey;
    width: 20px;
    display: inline-block;
    height: 20px;
    line-height: 8px;
    border-radius: 13px;
    color: grey;
  }
  .operate-button:hover {
    color: #000;
    cursor: pointer;
    opacity: 0.8;
  }
}
</style>
