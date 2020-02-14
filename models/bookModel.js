import HTTP, {
  wxPromise
} from '../util/http.js';

class BookModel extends HTTP {
  // 热门书籍在缓存中的key
  static BOOKKEYINSTORAGE = 'hot_book-list';
  // 热门搜索关键词在缓存中的key
  static HOTKEYWORDSINSTORAGE = 'hot_keywords';
  // 历史关键词在缓存中的key
  static HISTORYKEYWORDSINSTROAGE = 'history_keywords';

  /**
   * 通过关键词搜索获取books
   * @param {*} params 请求参数 {start: 0, count: 20, summary: 0, q:'搜索内容'}
   */
  getBooksByKeywords(params) {
    return this.request({
      url: "/book/search",
      data: params
    });
  }

  /**
   * setHistoryKeywordsToStorage进一步分装
   * 1.更新 historyKeywords,length最长10
   * 2.更新缓存 history_keywords
   * 3.关键词已经在历史搜索数组中，就将它移动到第一位
   * @param {*} newKey input键入的值
   * @param {*} oldKey 老得historyKeywords
   */
  addHistory(newKey, oldKey) {
    const index = oldKey.indexOf(newKey);
    // 关键词已经在历史搜索数组中，删除。后期在添加到第一位
    if (index !== -1) {
      oldKey.splice(index, 1);
    }
    // 长度大于等于10，就让其等于9，后期在添加一位
    if (oldKey.length >= 10) {
      oldKey.length = 9;
    }
    oldKey.unshift(newKey);

    this.setHistoryKeywordsToStorage({
      key: BookModel.HISTORYKEYWORDSINSTROAGE,
      data: oldKey,
    });

    return oldKey
  }

  /**
   * 缓存历史关键词：用户搜索过的内容
   * @param {*} param0 {key,data}
   */
  setHistoryKeywordsToStorage({ key, data }) {
    wxPromise(wx.setStorage, {
      key,
      data,
    })
  }

  /**
   * 获取缓存中的历史关键词
   */
  async getHistoryKeywordsFromStroage() {
    let historyKeywords = [];
    await wxPromise(wx.getStorage, {
      key: BookModel.HISTORYKEYWORDSINSTROAGE
    }).then(res => {
      historyKeywords = res.data;
    }).catch(err => {
      return historyKeywords;
    });
    return historyKeywords;
  }

  /**
   * 获取热搜关键字
   */
  async getHotKeywords() {
    // const hot = await this._getHotKeywordsFromStorage();
    // if (!hot) {
    return this.request({
      url: "/book/hot_keyword",
    }).then((data) => {
      const {
        hot
      } = data;
      // this._setHotKeywordsToStorage({
      //   key: KeywordsModel.HOTKEYWORDSINSTORAGE,
      //   data: hot
      // });
      return Promise.resolve(hot);
    });
    // }
    // return Promise.resolve(hot);
  }

  /**
   * 将热搜关键字缓存
   * @param {*} param0 {key,value}
   */
  _setHotKeywordsToStorage({
    key,
    data
  }) {
    wxPromise(wx.setStorage, {
      data,
      key,
    });
  }

  /**
   * 从缓存中获取热搜关键词
   */
  async _getHotKeywordsFromStorage() {
    let hot;
    await wxPromise(wx.getStorage, {
      key: BookModel.HOTKEYWORDSINSTORAGE
    }).then(res => {
      hot = res.data;
    }).catch(err => {
      return hot;
    })
    return hot
  }

  /**
   * 获取热门书籍(概要)
   */
  getHotBook() {
    return this.request({
      url: "/book/hot_list",
    })
  }

  /**
   * 向服务器提交新短评
   * @param {*}  
   */
  submitNewShortComment(book_id, content) {
    return this.request({
      url: `/book/add/short_comment`,
      method: 'POST',
      data: {
        book_id,
        content,
      }
    });
  }

  /**
   * 获取书籍详细信息，根据bid
   * @param {*} bookId 
   */
  getBookDetail(bookId) {
    return this.request({
      url: `/book/${bookId}/detail`
    })
  }

  /**
   * 获取书籍点赞情况
   * @param {*} bookId 
   */
  getBookLikeInfo(bookId) {
    return this.request({
      url: `/book/${bookId}/favor`
    });
  }

  /**
   * 获取热门书籍短评数据
   * @param {*} bookId 书籍id
   */
  getBookShortComment(bookId) {
    return this.request({
      url: `/book/${bookId}/short_comment`
    });
  }

  /**
   * 将热门书籍列表缓存
   * @param {*} param0 {key,value}
   */
  _setBookToStorage({
    key,
    data
  }) {
    wxPromise(wx.setStorage, {
      data,
      key,
    });
  }

  //从缓存中获取热门书籍列表
  async _getBookFromStorage() {
    let book;

    await wxPromise(wx.getStorage, {
      key: BookModel.BOOKKEYINSTORAGE,
    }).then((res) => {
      book = res.data;
    }).catch((err) => {
      return book;
    })

    return book;
  }
}

export default BookModel;