<template>
  <label class="label">
    {{ item.name }}：<br>[ {{ item.key }} ] &nbsp;&nbsp;
  </label>
</template>

<script>
  export default {
    name: 'LabelForInput',
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
    }
  };
</script>
