<template>
  <div :class="classes">
    <div class="tag r3-outlink">
      <Dropdown>
        <svg class="r3-svg-icon" aria-hidden="true">
          <use xlink:href="#icon-tiaozhuan"></use>
        </svg>
        <DropdownMenu slot="list">
          <DropdownItem v-for="(item,i) in icon" :key="i" @click.native="outlink(item)">
             <svg class="r3-svg-icon" aria-hidden="true">
                <use :xlink:href="`#icon-${item}`"></use>
            </svg>
            <span>boss xitong</span>
          </DropdownItem>
          
         
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { classFix } from '../../constants/global';

import '../../assets/svg/iconfont';

export default {
  name: 'OutLink',
  data() {
    return {
      icon:['BOS_logo','yunque','bojun']
    };
  },
  computed: {
    classes() {
      return [`${classFix}out-link`];
    },
  },
  methods: {
    outlink(item) {
      console.log(item,'121212====1212');
    },
  },
  mounted() {},
};
</script>
