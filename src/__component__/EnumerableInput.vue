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
          :class="{ picked: itemPicked[index], disabled: isDefault && !item.clickableWhenEdit }"
          @click="itemClick(index, item)"
        >
          {{ item.text }}
        </li>
      </template>
      <li
        class="pickedAll"
        :class="{ disabled: isDefault }"
        @click="pickAll"
      >
        {{ pickedAll ? '清空' : '全选' }}
      </li>
    </ul>
  </div>
</template>

<script>
  import {
    VERTICAL_TABLE_DETAIL_PREFIX,
    HORIZONTAL_TABLE_DETAIL_PREFIX,
    MODULE_COMPONENT_NAME,
    INSTANCE_ROUTE
  } from '../constants/global';
  import enumerableForColumn from '../constants/enumerateInputForColumn';
  import enumerableForTable from '../constants/enumerateInputForTable';
  
  export default {
    inject: [MODULE_COMPONENT_NAME, INSTANCE_ROUTE],
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
        if (this.isDefault && !item.clickableWhenEdit) {
          return;
        }
        this.itemPicked[index] = !this.itemPicked[index];
        this.computeValue();
        setTimeout(() => {
          this.$emit('valueChange', this.value);
        }, 0);
        this.pickedAll = !!this.hasPickedAll();
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
        const modalDom = this.findDomByClass(this.$refs.enumerableInput, 'ark-modal-content-drag');
        if (modalDom && modalDom.style.transform) {
          modalDom.style.transform = 'unset';
          modalDom.style.top = `${(document.body.clientHeight - modalDom.offsetHeight) / 2}px`;
        }
        if (!this.disabled) {
          this.dropdownShow = !this.dropdownShow;
          this.fixPosition();
        }
        setTimeout(() => {
          this.fixPosition();
        }, 100);
      },
      pickAll() {
        if (this.isDefault) { return; }
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
      },
      findDomByClass(dom, className) {
        if (dom.offsetParent && dom.offsetParent.classList.toString().indexOf(className) === -1) {
          return this.findDomByClass(dom.offsetParent, className);
        }
        return dom.offsetParent;
      },
      // 校验赋值是否合法
      validateAssignment(table, value) {
        switch (table) {
        case 'AD_TABLE':
          // 表的读写规则要求只能最多只能AMDQSVUB
          return !(value.length > 8 || /[^AMDQSVUB]/.test(value));
        case 'AD_COLUMN':
          // 字段的读写规则要求只能0和1的组合，且只能是10位。
          return !(value.length !== 10 || /[^0-1]/.test(value));
        default:
          break;
        }
        return false;
      },
      // 赋值逻辑
      assignment(table, value) {
        if (!this.validateAssignment(table, value)) { return; }
        this.value = value;
        this.$emit('valueChange', this.value);
        if (this.strictMode) {
          `${value}`.split('').forEach((d, i) => {
            if (d === '1') {
              this.itemPicked[i] = true;
            } else if (d === '0') {
              this.itemPicked[i] = false;
            }
          });
        } else {
          Object.keys(this.itemPicked).forEach((key) => { this.itemPicked[key] = false; });
          `${value}`.split('').forEach((d) => {
            this.itemPicked[this.enumerableLists.findIndex(sd => sd.value === d)] = true;
          });
        }
        // 处理默认的全选控制状态pickedAll逻辑
        this.pickedAll = this.hasPickedAll();
      },
      onPaste(event) {
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        this.assignment(this.$route.params.tableName, paste);
      },
    },
    computed: {
      isDefault() {
        // isdefault 是后台/p/cs/getObject接口的返回值，用于控制系统默认字段不可编辑。此处用于判断读写打印规则的设置逻辑。
        // if (this[INSTANCE_ROUTE].indexOf(VERTICAL_TABLE_DETAIL_PREFIX) > -1) {
        //   return this.$store.state[this[MODULE_COMPONENT_NAME]].mainFormInfo.formData.data.isdefault;
        // }
        // if (this[INSTANCE_ROUTE].indexOf(HORIZONTAL_TABLE_DETAIL_PREFIX) > -1) {
        //   return this.$store.state[this[MODULE_COMPONENT_NAME]].copyDataForReadOnly.isdefault;
        // }
        return false;
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
      this.$refs.enumerableInput.instance = this;
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
      this.$refs.input.$el.addEventListener('paste', this.onPaste);
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
