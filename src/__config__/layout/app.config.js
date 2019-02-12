export default {
  direction: 'column',
  items: [
    {
      height: 50,
      style: {
        backgroundColor: 'black'
      },
    },
    {
      weight: 1,
      layout: {
        direction: 'row',
        items: [
          {
            width: 180,
            style: {
              backgroundColor: 'darkred',
            },
          },
          {
            weight: 1,
            style: {
              backgroundColor: 'green',
            },
          }
        ]
      }
    }
  ],
};
