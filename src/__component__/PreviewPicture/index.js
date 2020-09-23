import { Modal } from 'ark-ui';
import Vue from 'vue';
// 图片预览
import PreviewPicture from './index.vue';

export default (array = [], items = {}) => {
  // 获取body并且创建一个新的div节点
  if (!document.getElementById('imgPreview')) {
    const body = document.body;
    const bindPhone = document.createElement('div');
    
    // 给创建的div设置id=message，并且添加到body后
    bindPhone.setAttribute('id', 'imgPreview');
    body.appendChild(bindPhone);
  }

  return new Vue({
    render: h => h(
      Modal,
      {
        props: {
          value: true,
          'class-name': items.field,
          draggable: true,
          title: '图片预览',
          'z-index': 10001,
          'footer-hide': true,
          closable: true
        }
      }, [
        h('div', {
          slot: 'header',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center'
          }
        }, '图片预览'),
        h(PreviewPicture, {
          props: {
            images: array
          }
        })
      ]
    )
  }).$mount('#imgPreview');
};
