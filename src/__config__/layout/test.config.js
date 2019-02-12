export default {
  direction: 'row',
  items: [
    {
      width: 180,
      style: {
        backgroundColor: 'white'
      },
      component: () => import('../../__component__/EmptyPage')
    },
    {
      weight: 2,
      style: {
        backgroundColor: 'grey'
      },
      layout: {
        direction: 'column',
        items: [
          {
            weight: 1,
            style: {
              backgroundColor: 'darkred',
            },
          },
          {
            height: 300,
            width: 200,
            style: {
              backgroundColor: 'green',
            },
            component: () => import('../../__component__/EmptyPage')
          },
          {
            weight: 1,
            style: {
              backgroundColor: 'lightgrey',
            },
          }
        ]
      }
    },
    {
      weight: 1,
      style: {
        backgroundColor: 'blue'
      },
    },
    {
      weight: 1,
      style: {
        backgroundColor: 'red'
      },
    },
  ],
};
