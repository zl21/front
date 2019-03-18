
import network, { urlSearchParams } from '../__utils__/network';

export default function fkQueryList(params) {
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject })).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
}
