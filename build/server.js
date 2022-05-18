const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');

app.use(history({

  verbose: true,
  index: 'index.html'

}))
app.use(express.static('dist'));

const { createProxyMiddleware } = require('http-proxy-middleware');
let url = 'http://120.79.145.203/';
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
  console.info('打开浏览器', 'http://192.168.5.210:3500');
});