import ContentDisplayArea from '../src/__component__/ContentDisplayArea';

export default {
  direction: 'column',
  class:'r3-horizontal-content',
  items: [
    {
      weight: 1,
      class:'r3-content-div',
      layout: {
        direction: 'row',
        class:'r3-content-box',
        items: [
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
