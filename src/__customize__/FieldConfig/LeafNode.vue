<template>
  <div class="leaf-node">
    <div class="leaf-node-l">
      <div class="leaf-node-icon" :class="{'leaf-mr': data.showClose}">
        <i class="iconfont icon-field" v-if="!data.showClose"></i>
      </div>
      <span class="leaf-node-value">{{data.title}}</span>
    </div>

    <i
      class="iconfont icon-md-close"
      @click="handleDelete($event)"
      v-if="data.showClose"
    ></i>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'leaf-node',

  props: {
    data: {
      type: Object,
    }
  },

  data() {
    return {

    }
  },

  methods: {
    handleDelete() {

    }
  }
}
</script>

<style lang="scss">
</style>