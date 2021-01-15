
export const createWatermark = (object) => {
  const mark_divs = document.getElementsByClassName('mark_div');
  if (mark_divs.length > 0) {
    for (let i = mark_divs.length - 1; i >= 0; i--) {
      document.body.removeChild(mark_divs[i]);
    }
  }
  
  // 默认设置
  const defaultSettings = {
    watermark_color: 'red', // 水印字体颜色
    watermark_alpha: 0.4, // 水印透明度
    watermark_fontsize: '14px', // 水印字体大小
    watermark_font: '微软雅黑', // 水印字体
    watermark_width: 200, // 水印宽度
    watermark_height: 80, // 水印长度
    watermark_angle: 15, // 水印倾斜度数
    watermark_intervalWidth: 100, //  间隔宽度
    watermark_intervalheight: 100, // 间隔高度
  };
  const maxWidth = document.documentElement.offsetWidth;
  const maxHeight = document.documentElement.offsetHeight;
  const rowNumber = (maxWidth - 40 - 100) / defaultSettings.watermark_intervalWidth; // 横向个数
  const coumnNumber = (maxHeight - 40 - 80) / defaultSettings.watermark_intervalheight; // 纵向个数
  
  
  const _temp = document.createDocumentFragment();
  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < coumnNumber; j++) {
      const x = defaultSettings.watermark_intervalWidth * i + 20;
      const y = defaultSettings.watermark_intervalheight * j + 30;
      const mark_div = document.createElement('div');
      mark_div.id = `mark_div${i}${j}`;
      mark_div.className = 'mark_div';
      // /三个节点
      
      object.textContent.forEach((element) => {
        const span0 = document.createElement('div');
        span0.appendChild(document.createTextNode(element));
        mark_div.appendChild(span0);
      });
      // 设置水印div倾斜显示
      mark_div.style.webkitTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
      mark_div.style.MozTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
      mark_div.style.msTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
      mark_div.style.OTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
      mark_div.style.transform = `rotate(-${defaultSettings.watermark_angle}deg)`;
      mark_div.style.visibility = '';
      mark_div.style.position = 'absolute';
      mark_div.style.left = `${x}px`;
      mark_div.style.top = `${y}px`;
      mark_div.style.overflow = 'hidden';
      mark_div.style.zIndex = '9999';
      mark_div.style.pointerEvents = 'none'; // pointer-events:none  让水印不阻止交互事件
      mark_div.style.opacity = defaultSettings.watermark_alpha;
      mark_div.style.fontSize = defaultSettings.watermark_fontsize;
      mark_div.style.fontFamily = defaultSettings.watermark_font;
      mark_div.style.color = defaultSettings.watermark_color;
      mark_div.style.textAlign = 'center';
      mark_div.style.width = `${defaultSettings.watermark_width}px`;
      mark_div.style.height = `${defaultSettings.watermark_height}px`;
      mark_div.style.display = 'block';
      _temp.appendChild(mark_div);
    }
  }
  document.body.appendChild(_temp);
};
  
export default createWatermark;
