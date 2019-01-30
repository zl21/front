<template>
  <div
    :style="{
      flexDirection: layoutConfig.direction,
      display: 'flex',
      height: '100%',
      overflow: 'hidden'
    }"
  >
    <div
      v-for="(data, index) in layoutConfig.items"
      :key="`MainFlexItem-${index}`"
      :style="[data.style, Object.assign({}, data.width !== undefined ? {
        width: `${data.width}px`
      } : {
        flexShrink: data.weight,
        flexGrow: data.weight,
        flexBasis: '1px',
      }, { overflow: 'hidden' })]"
    >
      <component v-if="data.component" :is="data.component"></component>
      <div
        v-if="data.subLayout !== undefined"
        :style="{
          flexDirection: data.subLayout.direction,
          display: 'flex',
          height: '100%',
          overflow: 'hidden'
        }"
      >
        <div
          v-for="(subData, subIndex) in data.subLayout.items"
          :key="`SubFlexItem-${subIndex}`"
          :style="[subData.style, Object.assign({}, subData.width !== undefined ? {
            width: `${subData.width}px`
          } : {
            flexShrink: subData.weight,
            flexGrow: subData.weight,
            flexBasis: '1px',
          }, { overflow: 'hidden' })]"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import appLayout from './__config__/layout/app.config';

  export default {
    name: 'App',
    data() {
      return {
        layoutConfig: appLayout
      };
    },
  };
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
</style>
