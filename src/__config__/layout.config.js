import Navigator from '../__component__/Navigator';
import ContentDisplayArea from '../__component__/ContentDisplayArea';
import HistoryAndFavorite from '../__component__/HistoryAndFavorite';

export default {
  direction: 'column',
  items: [
    {
      height: 50,
      component: Navigator,
    },
    {
      weight: 1,
      style: {
        backgroundColor: '#f1f1f1'
      },
      layout: {
        direction: 'row',
        items: [
          {
            component: HistoryAndFavorite,
          },
          {
            weight: 1,
            style: { margin: '10px', backgroundColor: '#fff', overflowX: 'hidden' },
            component: ContentDisplayArea,
          }
        ]
      }
    }
  ],
};
