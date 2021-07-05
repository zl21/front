import {urlSearchParams } from '../../utils/http.js';
import deepClone from "../../utils/deepClone";
export default {
  created () {
    // this.$axios = http;
    this.$deepClone = deepClone;
    this.urlSearchParams = urlSearchParams;
  },
  methods: {
    post(url, Message, callback) {
            this.$axios.post(url, Message).then((res) => {
                if (res.data.code === 0) {
                    const data = res.data;
                    callback(data);
                }
            });
    }
  }
}