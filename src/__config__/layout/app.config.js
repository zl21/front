export default {
  direction: 'row',
  items: [
    {
      width: 120,
      style: {
        backgroundColor: 'black'
      },
    },
    {
      weight: 2,
      style: {
        backgroundColor: 'grey'
      },
      subLayout: {
        direction: 'column',
        items: [
          {
            weight: 1,
            style: {
              backgroundColor: 'darkred',
            },
          },
          {
            weight: 1,
            style: {
              backgroundColor: 'green',
            },
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
