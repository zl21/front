import Navigator from '../__component__/Navigator';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import HistoryAndFavorite from '../__component__/HistoryAndFavorite';
import navAlert from '../__component__/nav/Alert.vue';
export default {
  direction: 'column',
  class:'r3-horizontal-content',
  items: [
    {
      height: 50,
      class:'r3-content-Navigator',
      component: Navigator,
      name: 'Navigator', // global.showModule.Navigator = false时，此选项不渲染。
    },
    {
      class:'r3-content-Alert',
      component: navAlert,
      name: 'Navigator-Alert',
    },
    {
      weight: 1,
      class:'r3-content-div',
      style: {
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
      },
      layout: {
        direction: 'row',
        class:'r3-content-box',
        items: [
          {
            class:'r3-content-HistoryAndFavorite',
            component: HistoryAndFavorite,
          },
          {
            id: 'ContentDisplayArea',
            class:'r3-content-ContentDisplayArea',
            weight: 1,
            style: { margin: '10px', backgroundColor: '#fff', overflow: 'hidden' },
            component: ContentDisplayArea,
          }
        ]
      }
    }
  ],
};
