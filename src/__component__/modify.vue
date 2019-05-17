<template>
  <div>
    <component
      :is="'CompositeFormPanel'"
      class="formPanel"
      type="PanelForm"
      @formChange="formPanelChange"
      @InitializationForm="initFormPanel"
      @VerifyMessage="verifyFormPanel"
    />
  </div>
</template>
<script>
  import CompositeFormPanel from './CompositeForm.vue';
  
  export default {
    name: 'Modify',
    components: {
      CompositeFormPanel
    },
    methods: {


    }
  };
</script>
