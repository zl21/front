import Vue from 'vue';
import { getGuid } from './src/__utils__/random';
import App from './src/App';

const createDOM = () => {
  const div = document.createElement('div');
  div.setAttribute('id', getGuid());
  document.body.appendChild(div);
  return div;
};

const init = () => {
  const rootDom = createDOM();
  new Vue({
    render: createElement => createElement(App)
  }).$mount(rootDom);
};

init();
