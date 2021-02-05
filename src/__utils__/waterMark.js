
export const createWatermark = (object) => {
  const defaultSettings = {
    textContent: ['请设置水印显示文字'], // 每行显示的文本内容
    watermark_intervalWidth: 100, //  间隔宽度
    watermark_intervalheight: 100, // 间隔高度
    style: {
      webkitTransform: 'rotate(-25deg)',
      MozTransform: 'rotate(-25deg)',
      msTransform: 'rotate(-25deg)',
      OTransform: 'rotate(-25deg)',
      transform: 'rotate(-25deg)',
      visibility: '',
      position: 'absolute',
      overflow: 'hidden',
      zIndex: '9999',
      pointerEvents: 'none', // pointer-events:none  让水印不阻止交互事件
      opacity: 0.2,
      fontSize: '14px',
      fontFamily: '微软雅黑',
      color: '#575757',
      textAlign: 'left',
      width: '200px',
      height: '30px',
      display: 'block',
    }
  };

  const mark_divs = document.getElementsByClassName('mark_div');

  if (mark_divs.length > 0) {
    for (let i = mark_divs.length - 1; i >= 0; i--) {
      document.body.removeChild(mark_divs[i]);
    }
  }
  const setting = Object.assign({}, defaultSettings, object);
  const _temp = document.createDocumentFragment();
  const dom = setting.id ? document.querySelector(`#${setting.id}`) : document.body.appendChild(_temp);
  console.log(333, dom.offsetHeight);
  const maxWidth = dom.offsetWidth;
  const maxHeight = dom.offsetHeight;
  const rowNumber = (maxWidth - 40 - 40) / setting.watermark_intervalWidth; // 横向个数
  const coumnNumber = (maxHeight - 40 - 60) / setting.watermark_intervalheight; // 纵向个数
 

  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < coumnNumber; j++) {
      const x = setting.watermark_intervalWidth * i + 20;
      const y = setting.watermark_intervalheight * j + 30;
      const mark_div = document.createElement('div');
      mark_div.id = `mark_div${i}${j}`;
      mark_div.className = 'mark_div';
      Object.assign(mark_div.style, setting.style);
      mark_div.style.left = `${x}px`;
      mark_div.style.top = `${y}px`;
      setting.textContent.forEach((element) => {
        const span0 = document.createElement('div');
        span0.appendChild(document.createTextNode(element));
        mark_div.appendChild(span0);
      });
     
      _temp.appendChild(mark_div);
    }
  }
  const tpl = dom;
  tpl.appendChild(_temp);
};
  
export default createWatermark;
