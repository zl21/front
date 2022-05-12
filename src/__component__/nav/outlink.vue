<template>
  <div :class="classes" v-if="outList.length > 0">
    <div class="tag r3-outlink">
      <!-- 长度为1 -->
      <div
        v-if="outList.length === 1"
        @click="outlink(outList[0])"
      >
        <Tooltip
          width="50"
          trigger="hover"
        >
          <svg
          class="r3-svg-icon"
          aria-hidden="true"
          :style="svgColor(outList[0].icon)"
        >
          <use :xlink:href="`#${outList[0].icon}`"></use>
        </svg>
          <div slot="content">
            {{$t('buttons.jump')}}{{outList[0].type}}
          </div>
        </Tooltip>
        
      </div>
      <!-- 长度大于1 -->
      <Dropdown v-if="outList.length < 2">
        <svg class="r3-svg-icon" aria-hidden="true">
          <use xlink:href="#icon-tiaozhuan"></use>
        </svg>
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item, i) in outList"
            :key="i"
            @click.native="outlink(item)"
          >
            <svg
              class="r3-svg-icon"
              aria-hidden="true"
              :style="svgColor(item.icon)"
            >
              <use :xlink:href="`#${item.icon}`"></use>
            </svg>
            <span>{{ item.type }}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { classFix, Version } from '../../constants/global';
import network from '../../__utils__/network';
import '../../assets/svg/iconfont';

export default {
  name: 'OutLink',
  data() {
    return {
      icon: {
        'icon-BOS_logo': {
          color: '#3699FE',
        },
        'icon-yunque': {
          color: '#1d74ff',
        },
        'icon-bojun': {
          color: '#438EB9',
        },
      },
      outList: [],
    };
  },
  computed: {
    classes() {
      return [`${classFix}out-link`];
    },
    svgColor() {
      return function(val) {
        return `color:${this.icon[val].color}`;
      };
    },
  },
  methods: {
    outlink(item) {
      // 跳转单点登录
      network
        .post('/p/cs/ssothirdsystem', { type: item.type })
        .then((res) => {
          if (res.data.code === 0) {
            let url = res.data.data;
            window.open(url);
          }
        })
        .catch(() => {});
    },
    init() {
      // 初始化获取icon
      network
        .post('/p/cs/ssosystemlist')
        .then((res) => {
          if (res.data.code === 0) {
            console.log(res.data.data, '=====res');
            this.outList = res.data.data;
          }
        })
        .catch(() => {});
    },
  },
  mounted() {
    let { SingleSignOnSwitch } = window.ProjectConfig;
    if (Version() === '1.4' && SingleSignOnSwitch) {
      this.init();
    }
  },
};
</script>
