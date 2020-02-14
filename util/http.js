import config from '../config.js';

const tips = {
  [-1]: "抱歉出现了一个错误",
  1000: "输入参数错误",
  1001: "输入的json格式不正确",
  1002: "找不到资源",
  1003: "未知错误",
  1004: "禁止访问",
  1005: "不正确的开发者key",
  1006: "服务器内部错误",
  2000: "你已经点过赞了",
  2001: "你还没点过赞",
  3000: "该期内容不存在",
};

/**
 * 主调用接口类
 */
class HTTP {
  request({
    url,
    method = "GET",
    data={},
  }) {
    const $this = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.api_base_url + url,
        header: {
          appkey: config.appkey,
          responseType: "application/json",
        },
        data,
        method,
        success: (res) => {
          let code = res.statusCode;
          // 如果状态码是 2开头
          if (String(code).startsWith('2')) {
            const {
              data
            } = res;
            resolve(data);
          } else {
            // console.log("请求数据状态码为" + code);
            let error_code = res.data.error_code;
            $this._show_error(error_code);
            reject(error_code);
          }

        },
        fail(err) {
          reject(err);
          $this._show_error();
        }
      });
    }).catch(err => {
      console.log("接口调用失败的回调函数", err);
    })
  }

  _show_error(error_code = -1) {
    wx.showToast({
      title: tips[error_code],
      icon: "none",
      duration: 2000,
    })
  }
}

/**
 * 将微信小程序异步api转成 Promise。例子：wxPromise(wx.setStorage, { key, data });
 * @param {*} func 微信小程序的异步api。wx.setStorage
 * @param {*} params {key,data,success,fail,complete}
 */
const wxPromise = function (func, params = {}) {
  return new Promise((resolve, reject) => {
    const args = Object.assign({
      success(data) {
        resolve(data)
      },
      fail(err) {
        reject(err);
      }
    }, params);
    func(args);
  });
}

export default HTTP;
export {
  wxPromise
};