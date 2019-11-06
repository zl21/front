<template>
  <div
    ref="enumerableInput"
    class="enumerableInput"
    @click="toggleDropdownShow"
  >
    <Input
      ref="input"
      :value="value"
      readonly
      :disabled="disabled"
      @on-keydown="onKeydown"
    />
    <ul
      v-show="dropdownShow"
      class="arrow"
      :style="{ top: `${style.top}px` }"
      @click.stop
    >
      <template
        v-for="(item, index) in enumerableLists"
      >
        <li
          v-if="!item.hide"
          :key="index"
          :class="{ picked: itemPicked[index], disabled: $route.params.itemId !== 'New' && !item.clickableWhenEdit }"
          @click="itemClick(index, item)"
        >
          {{ item.text }}
        </li>
      </template>
      <li
        class="pickedAll"
        :class="{ disabled: $route.params.itemId !== 'New' }"
        @click="pickAll"
      >
        {{ pickedAll ? '清空' : '全选' }}
      </li>
    </ul>
  </div>
</template>

<script>
  import enumerableForColumn from '../constants/enumerateInputForColumn';
  import enumerableForTable from '../constants/enumerateInputForTable';
  
  export default {
    data: () => ({
      scrollTimeoutTick: -1,
      style: {
        top: 0
      },
      itemPicked: {},
      value: '',
      dropdownShow: false,
      pickedAll: true,
      enumerableLists: [],
      strictMode: true,
    }),
    name: 'EnumerableInput',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      enumerableConfig: {
        type: Object,
        default: () => ({
          enumerableLists: [],
          strictMode: true
        })
      },
      defaultValue: {
        type: [String, Number],
        default: ''
      },
    },
    methods: {
      onKeydown(e) {
        this.$emit('keydown', e);
      },
      fixPosition() {
        const inputElement = this.$refs.enumerableInput.querySelector('input');
        const { top } = inputElement.getBoundingClientRect();
        this.style.top = top + inputElement.offsetHeight + 7;
      },
      computeValue() {
        const v = this.enumerableLists.map((d, i) => {
          if (this.itemPicked[i]) {
            return d.value;
          } 
          if (this.strictMode) {
            return 0;
          }
          return this.strictMode ? 0 : '';
        }).toString().replace(/,/g, '');
        this.value = v;
        return v;
      },
      itemClick(index, item) {
        if (this.$route.params.itemId !== 'New' && !item.clickableWhenEdit) {
          return;
        }
        if (!this.itemPicked[index]) {
          this.itemPicked[index] = true;
        } else {
          this.itemPicked[index] = false;
        }
        this.computeValue();
        setTimeout(() => {
          this.$emit('valueChange', this.value);
        }, 0);
        if (this.hasPickedAll()) {
          this.pickedAll = true;
        } else {
          this.pickedAll = false;
        }
      },
      clickEventListener(event) {
        if (event.target !== this.$refs.enumerableInput.querySelector('input')) {
          this.dropdownShow = false;
        }
      },
      scrollEventListener() {
        if (!this.dropdownShow) { return; }
        this.scrollTimeoutTick = setTimeout(() => {
          clearTimeout(this.scrollTimeoutTick);
          this.fixPosition();
        }, 10);
        this.fixPosition();
      },
      toggleDropdownShow() {
        if (!this.disabled) {
          this.dropdownShow = !this.dropdownShow;
          this.fixPosition();
        }
      },
      pickAll() {
        if (this.$route.params.itemId !== 'New') { return; }
        this.enumerableLists.forEach((d, i) => {
          this.itemPicked[i] = !this.pickedAll;
        });
        this.computeValue();
        setTimeout(() => {
          this.$emit('valueChange', this.value);
        }, 0);
        this.pickedAll = !this.pickedAll;
      },
      hasPickedAll() {
        // 基于当前选中值判断是否处理全选状态。
        return !this.enumerableLists.some((d, i) => !this.itemPicked[i]);
      }
    },
    created() {
      if (this.$route.params.tableName === 'AD_COLUMN') {
        this.enumerableLists = enumerableForColumn.enumerableLists;
        this.strictMode = enumerableForColumn.strictMode;
      } else if (this.$route.params.tableName === 'AD_TABLE') {
        this.enumerableLists = enumerableForTable.enumerableLists;
        this.strictMode = enumerableForTable.strictMode;
      } else {
        this.enumerableLists = this.enumerableConfig.enumerableLists;
        this.strictMode = this.enumerableConfig.strictMode;
      }
    },
    mounted() {
      this.computeValue();
      if (this.defaultValue !== undefined) {
        this.value = this.defaultValue;
        if (this.strictMode) {
          `${this.defaultValue}`.split('').forEach((d, i) => {
            if (d === '1') {
              this.itemPicked[i] = true;
            }
          });
        } else {
          `${this.defaultValue}`.split('').forEach((d) => {
            this.itemPicked[this.enumerableLists.findIndex(sd => sd.value === d)] = true;
          });
        }
        // 处理默认的全选控制状态pickedAll逻辑
        this.pickedAll = this.hasPickedAll();
      }
      document.body.addEventListener('click', this.clickEventListener);
      window.addEventListener('scroll', this.scrollEventListener, true);
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.clickEventListener);
      window.removeEventListener('scroll', this.scrollEventListener, true);
    }
  };
</script>

<style scoped lang="less">
  .enumerableInput {
    position: relative;
    user-select: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  input {
    width: 100%;
    cursor: pointer;
    letter-spacing: 2px;
    padding-left: 5px;
    padding-right: 5px;
    text-overflow: ellipsis;
    user-select: none;
  }
  input:hover {
    opacity: 0.8;
  }
  ul {
    border-radius: 2px;
    padding: 5px;
    position: fixed;
    min-width: 210px;
    max-width: 300px;
    border: 1px solid #d8d8d8;
    background-color: #fff;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    li {
      list-style: none;
      margin: 2px 4px;
      padding: 5px;
      cursor: pointer;
      border: 1px solid orangered;
      color: orangered;
      border-radius: 2px;
    }
    li:hover {
      opacity: 0.7;
    }
    li.picked {
      border: 1px solid orangered;
      background-color: orangered;
      color: #fff;
    }
    li.disabled {
      border: 1px solid #d8d8d8;
      background-color: #f4f4f4;
      color: #c3c3c3;
      cursor: not-allowed;
    }
  }
  .arrow:before{
    display:block;
    content:'';
    border-width:7px;
    border-style:solid;
    border-color:transparent transparent #d8d8d8 transparent;
    position:absolute;
    left:45%;
    top:-14px;
  }
  .pickedAll {
    padding: 6px 7px;
    cursor: pointer;
  }
  .pickedAll.disabled {
    border: 1px solid #d8d8d8;
    background-color: #f4f4f4;
    color: #c3c3c3;
    cursor: not-allowed;
  }
  .pickedAll:hover {
    opacity: 0.75;
    -webkit-box-shadow: 1px 1px 1px 1px;
    -moz-box-shadow: 1px 1px 1px 1px;
    box-shadow: 1px 1px 1px 1px;
  }
</style>
