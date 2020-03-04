export const data = () => { 
  const a = [
    {
      expand: true, // 是否开启

      title: 'ceshi',
      TREENO: 2,
      MIXNAME: '[001]ceshi',
      ECODE: '001',
      RIGHTVALUE: 12,
      ID: 2,
      LEFTVALUE: 1,
      clickNode: true,
      children: [
        {
          title: 'CYX内部组织档案',
          TREENO: 2,
          MIXNAME: '[10001]CYX内部组织档案',
          ECODE: '10001',
          RIGHTVALUE: 7,
          ID: 7,
          CP_C_ORGUP_ID: 2,
          LEFTVALUE: 4,
          lastChild: false,
          children: [
            {
              title: '销售部',
              TREENO: 2,
              MIXNAME: '[011]销售部',
              ECODE: '011',
              RIGHTVALUE: 6,
              ID: 13,
              CP_C_ORGUP_ID: 7,
              LEFTVALUE: 5,
              lastChild: true,
              children: []
            }
          ]
        },
        {
          title: '11',
          TREENO: 2,
          MIXNAME: '[11]11',
          ECODE: '11',
          RIGHTVALUE: 9,
          ID: 10,
          CP_C_ORGUP_ID: 2,
          LEFTVALUE: 8,
          lastChild: false,
          children: []
        },
        {
          title: '12',
          TREENO: 2,
          MIXNAME: '[12]12',
          ECODE: '12',
          RIGHTVALUE: 3,
          ID: 1,
          CP_C_ORGUP_ID: 2,
          LEFTVALUE: 2,
          lastChild: false,
          children: []
        },
        {
          title: 'llnlin',
          TREENO: 2,
          MIXNAME: '[LINLIN]llnlin',
          ECODE: 'LINLIN',
          RIGHTVALUE: 11,
          ID: 12,
          CP_C_ORGUP_ID: 2,
          LEFTVALUE: 10,
          lastChild: true,
          children: []
        }
      ]
    }
  ];
  return a; 
};
export default { data };
