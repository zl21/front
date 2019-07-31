<template>
  <div class="FormComponent">
    <div
      class="FormItemComponent"
      :style="setWidth"
    >
      <div
        v-for="(item,index) in dataColRol"
        :key="index"
        class="FormItemComponent-item"
        :style="setDiv(item)"
      >
        <component
          :is="item.component"
          :ref="'component_'+index"
          :index="index"
          :items="item.item"
          @inputChange="inputChange"
        />
      </div>
    </div>
    <p v-if="buttonType">
      <Button type="primary" @click="search">搜索</Button>
      <Button type="fcdefault" @click="reset">重置</Button>
    </p>
  </div>

</template>
<script>
import Vue from 'vue';
import layoutAlgorithm from '../utils/layoutAlgorithm'
export default {
  name:'FormItemComponent',
  props:{
    formItemLists: {
      type: Array,
      default() {
        return [];
      }
    },
    buttonType:{
      type: Boolean,
      default(){
        return true
      }
    },
    defaultColumn:{
      type: Number,
      default:4
    }
  },
  computed: {
    // 通过layoutAlgorithm算法得到对应的位置坐标
    dataColRol() {
      const list = layoutAlgorithm(this.defaultColumn, this.currentFormList);
      return Object.keys(list).reduce((temp, current) => {
        // 计算显示行数
        list[current].component = Vue.extend(list[current].component);
        temp.push(list[current]);
        return temp;
      }, []);
    },
    // 计算属性的 div 的坐标起始点
    setDiv() {
      return item => ` grid-column:${item.x}/${item.col + item.x};grid-row:${item.y}/${item.y + item.row};`;
    },
    // 计算属性的 div的排列格式
    setWidth() {
      // `this` 指向 vm 实例
      const columns = Number(this.defaultColumn) || 4;
      return `grid-template-columns: repeat(${columns},${100 / columns}%`;
    }
  },
  watch:{
    formItemLists () {
      this.currentFormList = this.formItemLists.concat([])
    }
  },
  data () {
    return {
     // defaultColumn:4,  //默认一行4列
      formData:{}, //保存form中输入数据
      currentFormList:[]
    }
  },
  created () {
    this.currentFormList = this.formItemLists.concat([])
  },
  methods:{
    inputChange (value,items) { //有数据改变时
      // if(Object.prototype.toString.call(value) === '[object Array]' && (!value[0] || !value[1])){
      //   delete this.formData[items.filed]
      // }else{
      //   this.formData[items.filed] = value
      // }
      this.formData[items.filed] = value
      this.$emit('formChange',this.formData)
    },
    search () {
      this.$emit('search',this.formData)
    },
    reset () {
      this.formData = {}
      this.currentFormList = this.currentFormList.concat([])
      this.$emit('search',this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
.FormComponent{
  padding: 2px 10px 10px 10px;
  border:1px solid rgba(228,228,228,1);
}

.FormComponent > p{
  padding-left: 108px;
  margin-top: 10px;
  display: flex;
  width: 300px;

  >button{
    margin-right: 10px;
  }
}
.FormItemComponent > div {
  /*border:1px solid #fff;*/
  box-sizing: border-box;
}
.FormItemComponent {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: minmax(auto);
}
</style>

