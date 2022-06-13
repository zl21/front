<template>
  <div :class="prefixClass">
    <Tree :data="data"></Tree>
  </div>
</template>

<script type="text/ecmascript-6">
import LeafNode from './LeafNode.vue'
import Vue from 'vue'
Vue.component('AkLeafNode', LeafNode)
const prefixClass = `fold-tree`;

export default {
  name: 'FoldTree',

  data() {
    return {
      prefixClass,
      data: []
    }
  },

  methods: {
    renderTree() {
      const data = [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
            },
            {
              title: 'parent 1-2',
              expand: true,
            }
          ]
        },
        {
          title: 'parent 2',
          expand: true,
          children: [
            {
              title: 'parent 2-1',
              expand: true,
            },
            {
              title: 'parent 2-2',
              expand: true,
            }
          ]
        }
      ]

      data.forEach(firstLeaf => {
        firstLeaf.render = (h, { root, node, data }) => {
          return h('AkLeafNode', {
            props: {
              data: firstLeaf
            }
          })
        }
        firstLeaf.children.forEach(secondLeaf => {
          secondLeaf.showClose = true
          secondLeaf.render = (h, { root, node, data }) => {
            return h('AkLeafNode', {
              props: {
                data: secondLeaf
              }
            })
          }
        })
      })

      this.data = data
    }
  },

  mounted() {
    this.renderTree()
  }
}
</script>

<style lang="scss" scoped>
</style>