import paginationBeh from '../../behaviors/pagination-beh.js';
import BookModel from '../../../models/bookModel.js';
const bookModel = new BookModel();

Component({
  behaviors: [paginationBeh],
  options: {
    pureDataPattern: /^_/,
  },
  properties: {
    more: {
      type: Boolean,
      observer: 'loadMore',
    }
  },
  data: {
    searching: false, // 是否是显示search组件
    _isLoading: false, // 是否正在加载数据，用于tag input 以及下拉加载。限制只能有一个请求
    _keywords: '', // 搜索book的关键词
    _isShowSearchedBooks: false, //是否显示搜索的books列表
    noResult: false, // 搜索书籍无结果，就是请求结果返回[]
  },

  observers: {
    '_isShowSearchedBooks': function (newVal) {
      const { _keywords, _isLoading } = this.data;
      if (newVal && !_isLoading) {

        wx.showLoading()
        this._loaded();
        bookModel.getBooksByKeywords({ q: _keywords }).then(res => {
          const { books, total } = res;
          if (books.length === 0) {
            this.setData({
              noResult: true,
            });
          }

          this.setData({
            currentData: books,
          });
          this.setTotal(total);
          wx.hideLoading()
          this._unLoaded();
        }).catch(err => {
          wx.hideLoading()
          this._unLoaded();
        });
      }
    }
  },

  methods: {
    // 加载更多books数据
    loadMore() {
      const { _keywords, _isLoading, total } = this.data;
      // 如果没有keywords，或者正在请求数据中，也就没必要再次请求了
      if (!_keywords || _isLoading) return;
      // 当前books长度大于等于服务器数据总长度，那么就没必要再次请求了
      if (!this.hasMoreBooks()) return;
      this._loaded();
      this.loadedForBottom();
      bookModel.getBooksByKeywords({ q: _keywords, start: this.getCurrentStart() }).then(res => {
        const {books} = res;
        this.setMoreData(books);
        this.unLoadedForBottom();
        this._unLoaded();
      }).catch(err => {
        this.unLoadedForBottom();
        this._unLoaded();// 防止死锁，断网情况下_loaded=true导致没有将锁解开
      });
    },
    // 显示或隐藏search组件
    switchSearchComp(event) {
      const { detail: { searching, keywords, isShowSearchedBooks } } = event;
      if (!searching) {
        this.setData({
          searching: false,
          _keywords: keywords,
          _isShowSearchedBooks: isShowSearchedBooks
        })
      } else {
        this.initializationBooks();
      }
    },


    _loaded() {
      this.setData({
        _isLoading: true,
      });
    },
    _unLoaded() {
      this.setData({
        _isLoading: false,
      });
    },
  },

  lifetimes: {
    attached: function (options) {

      wx.showLoading()
      bookModel.getHotBook().then(res => {
        this.setData({
          currentData: res
        });
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
      });
    },
  },
})