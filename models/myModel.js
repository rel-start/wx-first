import HTTP, {
  wxPromise
} from '../util/http.js';

class MyModel extends HTTP {
  //获取喜欢的期刊
  getFavorClassic(params){
    return this.request({
      url: "/classic/favor",
      data: params
    });
  }
}

export default MyModel;