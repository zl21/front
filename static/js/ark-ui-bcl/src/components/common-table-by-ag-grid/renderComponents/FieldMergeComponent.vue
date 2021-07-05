<template>
  <div>
    <template v-for="(item, index) in tags">
      <Poptip
        v-if="item.comments"
        trigger="hover"
        transfer
        :key="item.webid"
        word-wrap
        width="200"
        :content="item.comments"
      >
        <span
          :key="index"
          :class="[item.cssclass, 'ak-ag-cell-tag', 'ak-ag-cell-tag-hover']"
        >{{item.description}}</span>
      </Poptip>
      <span
        v-else
        :key="index"
        :class="[item.cssclass, 'ak-ag-cell-tag']"
      >{{item.description}}</span>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',

  props: {
    params: {
      type: Object,
    }
  },

  data() {
    return {
      tags: []
    }
  },

  methods: {

  },

  mounted() {
    this.params.colDef.key_group.map(item => {
      const value = this.params.data[item.col_name]; // 来源字段的值
      item.label.map((temp) => {
        if (temp.value == value.val) {
          this.tags.push({
            cssclass: temp.cssclass,
            description: temp.description,
            comments: temp.comments,
          })
        }
        return temp;
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.ak-ag-cell-tag {
  display: inline-block;
  padding: 4px 6px;
  border: 1px solid;
  border-radius: 4px;
  line-height: 1;
}
.ak-ag-cell-tag-hover {
  cursor: pointer;
}
</style>