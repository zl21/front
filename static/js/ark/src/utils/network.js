import axios from 'axios';
import Vue from 'vue';

Vue.$httpRequestList = [];
const pending  = {};




let postConfig = {};
axios.interceptors.request.use(
    (config) => {
        config.baseURL = '';
        // if (postConfig && postConfig.loading !== false) {
        //   // 开启全局loading
        //   new Vue().$Loading.show();
        // }
        config.timeout = 12000;
        // 重复拦截
        if (config.url && config.data) {
            // clearHttpRequestingList(config);
            //console.log(clearHttpRequestingList(config),'111');
            // console.log(config.cancelToken,'111');
            config.url = config.url;
        }
        return config;
    },
    error => Promise.reject(error)
);

// eslint-disable-next-line new-cap
axios.interceptors.response.use((response) => {
    setTimeout(() => {
        // 关闭接口全局loading
        // new Vue().$Loading.hide();
    }, 200);

    if (response.data.code !== 0 && response.data.code) {
        const Message = {
            mask: true,
            title: '错误',
            content: response.data.message || response.data.data
        };


        window.vm.$Modal.error(Message);
    }

    return response;
}, (error) => {
    setTimeout(() => {
        // new Vue().$Loading.hide();
    }, 200);
    if (error.response) {
        const { status } = error.response;
        if (status === 403) {
            localStorage.clear();
            sessionStorage.clear();

        } else if (status === 500) {
            const msage = error.response.data.message || error.response.data.msg;
            const Message = {
                mask: true,
                title: '错误',
                content: msage
            };
            window.vm.$Modal.error(Message);
        }

        return error.response;
    }
    Promise.reject(error);
});

// 当post请求content-Type: application/x-www-form-urlencoded时，需要将JSON参赛转换成如下函数输入的形式。
export const urlSearchParams = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        const dataType = Object.prototype.toString.call(data[key]);
        if (dataType === '[object Object]' || dataType === '[object Array]') {
            data[key] = JSON.stringify(data[key]);
        }
        params.append(key, data[key]);
    });
    return params;
};

function NetworkConstructor() {
    this.post = (url, config) => {
        postConfig = config;
        if (config && config.params) {
            const message = config.params;
            return axios.post(url, message);
        }
        return axios.post(url, config);
    };
    this.get = (url, params) => {
        postConfig = params;
        return axios.get(url, params);
    };
}
export const http = new NetworkConstructor();
