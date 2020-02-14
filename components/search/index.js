import BookModel from '../../models/bookModel.js';
const bookModel = new BookModel();

Component({
  data: {
    isThereContent: false, //input中是否有内容，用于改变 img=cancel 的显示与否
    inputValue: '', //input中的内容
    hotKeywords: [], //热搜关键字
    historyKeywords: [], //历史关键字
  },

  methods: {
    // 通过关键词搜索 books
    searchByTapKeywords(event) {
      const { detail: { content } } = event;
      this._tapAndInputConfirmGroup(content);
    },

    //隐藏search组件
    hideSearchComp() {
      this.triggerEvent('search', {
        searching: false
      })
    },

    // 键盘触发时。改变 img=cancel 的显示与否
    onInput(event) {
      const {
        detail: {
          value
        }
      } = event;
      this.setData({
        isThereContent: value.length !== 0
      });
    },

    //清空input
    clearInput() {
      this.setData({
        inputValue: ''
      });
    },

    // input回车的执行方法
    onConfirm(event) {
      const value = event.detail.value.trim();
      if (value.length == 0) return;

      this._tapAndInputConfirmGroup(value);
    },

    // input提交与tag点击中 整合共同的代码
    _tapAndInputConfirmGroup(keywords) {
      let { historyKeywords } = this.data;
      // 将点击的tag内容存入storage
      historyKeywords = bookModel.addHistory(keywords, historyKeywords);

      this.setData({
        historyKeywords,
      });

      this._closeSearchComp(keywords);
    },

    // 关闭搜索组件，也就是相关的状态清空
    _closeSearchComp(keywords) {
      this.triggerEvent('search', {
        searching: false,
        isShowSearchedBooks: true,
        keywords,
      });
    }
  },

  lifetimes: {
    attached() {
      // 获得热搜关键词
      bookModel.getHotKeywords().then(res => {
        this.setData({
          hotKeywords: res
        });
      });
      // 获得历史关键词
      bookModel.getHistoryKeywordsFromStroage().then(res => {
        this.setData({
          historyKeywords: res
        });
      });
    }
  }

})