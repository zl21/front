import { mapState, mapActions, mapMutations } from 'vuex';
import router from '../router.config';
import {
  STANDARD_TABLE_COMPONENT_PREFIX, STANDARD_COMMONTABLE_COMPONENT_PREFIX, MODULE_COMPONENT_NAME, INSTANCE_ROUTE, INSTANCE_ROUTE_QUERY 
} from '../../constants/global';


export default () => ({
  provide: {
    type: 'verticalTableDetail'
  },
  data() {
    return {
      type: 'verticalTableDetail'
    };
  },
  created() {
 
  },
  mounted() {
  },
  methods: {
  },
  computed: {
   
  },
  activated() {
   
  },
  beforeDestroy() {
   
  },
  destroyed() {
    
  }
});
