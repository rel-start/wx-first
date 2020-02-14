import HTTP, {
  wxPromise
} from '../util/http.js';

class ClassicModel extends HTTP {
  // 最新期刊数据在缓存中的key
  static LATESTCLASSICKEYINSTORAGE = 'latestClassic';
  // 最新期刊号在缓存中的key
  static LATESTINDEXKEYINSTORAGE = 'latestIndex';

  // 获得最新期刊
  getLatest() {
    return this.request({
      url: "/classic/latest",
    }).then((data) => {
      this._setClassicToStorage({
        data
      });
      this._setLatestIndexToStorage(data.index);
      return Promise.resolve(data);
    })
  }

  /**
   * 获取期刊数据，可用于切换期刊
   * @param {int} index 需切换至的期刊号
   * @param {String} type 切换到上一期还是下一期。exp.'next', 'prev'
   */
  async getClassic(index, type) {
    const isNext = type === 'next';
    const curType = isNext ? '/next' : '/previous';
    // 对应相应缓存数据的key
    const key = isNext ? this._getKey(index + 1) : this._getKey(index - 1);
    const classic = await this._getClassicFromStorage(key);
    // 没拿到缓存数据就请求接口
    if (!classic) {
      return this.request({
        url: '/classic/' + index + curType,
      }).then((data) => {
        //  缓存接口数据到appData
        this._setClassicToStorage({
          key,
          data
        });
        return Promise.resolve(data);
      })
    }
    // 拿到缓存数据直接返回
    return Promise.resolve(classic);
  }

  /**
   * 是否是第一期
   * @param {int} index 期刊号
   */
  isFirst(index) {
    return index === 1;
  }

  /**
   * 是否是最后一期(最新)
   * @param {int} index  期刊号
   */
  async isLatest(index) {
    let latestIndex = await this._getLatestIndex();
    if (!latestIndex) {
      await this.getLatest();
      latestIndex = await this._getLatestIndex();
    }
    return index === latestIndex;
  }

  /**
   * 缓存期刊数据
   * @param {*} param0 {data:期刊数据,key}
   */
  _setClassicToStorage({
    data,
    key = ClassicModel.LATESTCLASSICKEYINSTORAGE
  }) {
    wxPromise(wx.setStorage, {
      key,
      data,
    });
  }

  /**
   * 缓存最新一期期刊号
   * @param index 期刊号
   */
  _setLatestIndexToStorage(index) {
    wxPromise(wx.setStorage, {
      key: ClassicModel.LATESTINDEXKEYINSTORAGE,
      data: index,
    });
  }

  /**
   * 根据key获取期刊数据
   * @param {String} key 
   */
  async _getClassicFromStorage(key) {
    let classic;
    await wxPromise(wx.getStorage, {
      key,
    }).then(res => {
      classic = res.data;
    }).catch(err => {
      return classic;
    });
    return classic;
  }

  /**
   * 获取最新一期期刊号
   */
  async _getLatestIndex() {
    let index;
    await wxPromise(wx.getStorage, {
      key: ClassicModel.LATESTINDEXKEYINSTORAGE
    }).then(res => {
      index = res.data;
    }).catch(err => {
      return index;
    })

    return index;
  }

  /**
   * 不同期刊号对应不同的appData缓存中的key，该缓存的value是每个期刊的内容
   * @param {int} index 期刊号
   */
  _getKey(index) {
    return "classic-" + index;
  }
}

export default ClassicModel;