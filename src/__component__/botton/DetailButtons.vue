<template>
  <div>
     <Button>【{{ item.name }}】</Button>
  </div>
</template>


<script type="text/ecmascript-6">
export default {
  name: 'detail-buttons',
  props: {
    // 外部传入的所有参数
    item: {
      type: Object,
      default: () => { }
    },
  }
};
</script>
