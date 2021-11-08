const express = require('express');
const app = express();
app.use(express.static('dist'));

const { createProxyMiddleware } = require('http-proxy-middleware');
let url = 'http://r3-8098.dev.syman.cn/';
app.use(
    '/p/cs',
    createProxyMiddleware({
        target:url ,
        changeOrigin: true
    })
);
app.use(
  '/p/c/',
  createProxyMiddleware({
      target: url,
      changeOrigin: true
  })
);
app.use(
  '/ad-app',
  createProxyMiddleware({
      target: url,
      changeOrigin: true
  })
);
app.listen(3500, () => {
  console.info('打开浏览器', 'http://127.0.0.1:3500');
});