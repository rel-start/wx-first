import BookModel from '../../models/bookModel.js';
const bookModel = new BookModel();

Page({
  data: {
    bookDetail: null, // 当前书籍详情
    bookLikeInfo: null, //当前书籍点赞情况
    bookShortComment: [], //当前书籍短评数组
    bookEntry: [], //书本信息条目
    summary: '', //摘要
    summary1: '', //隐藏的摘要
    summaryHeight: 'auto', //摘要的height
    summaryCanexpand: false, //摘要能否展开
    moreBtnclicked: false, //更多按钮是否点击过。true:展开，false:收起
    isposting: false, //是否显示隐藏层（真实可以评论的input）。true: 显示,false: 隐藏
  },

  // 更多按钮，用于摘要的展开与收起
  expandOrPutAwayMoreBtn() {
    const {
      moreBtnclicked,
    } = this.data;

    if (moreBtnclicked) { // 收起
      this.setData({
        summary1: this.collapseSummary(400),
        moreBtnclicked: !moreBtnclicked,
      }, () => {
        this.setSummaryHeight();
      });
    } else { // 展开
      this.setData({
        summary1: this.data.bookDetail.summary,
        summary: this.data.bookDetail.summary,
        moreBtnclicked: !moreBtnclicked,
      }, () => {
        this.setSummaryHeight();
      });
    }
  },

  // 摘要trainsitionend
  summaryTransitionEnd() {
    const {
      moreBtnclicked,
    } = this.data;
    // 收起
    if (!moreBtnclicked) {
      this.setData({
        summary: this.collapseSummary(400),
      });
    }
  },


  // 折叠的 摘要 
  collapseSummary(end, cb) {
    const {
      summary
    } = this.data.bookDetail;
    if (summary.length > end) {
      typeof cb === 'function' && cb();
      return summary.slice(0, end + 1) + "...";
    }
    return summary;
  },

  //设置摘要的height
  setSummaryHeight() {
    const query = wx.createSelectorQuery();
    query.select('.bdetail-summary1').boundingClientRect(); // 隐藏摘要的样式
    query.exec(res => {
      this.setData({
        summaryHeight: res[0].height + "px"
      });
    });
  },
  // 添加短评。点击tag、input提交
  addBookShortComment(event) {
    const {
      content
    } = event.detail;
    if (content.length === 0) return;
    const {
      bookShortComment
    } = this.data;
    bookShortComment.unshift({
      content,
      nums: 1,
    });

    this.setData({
      bookShortComment,
      isposting: false,
    }, () => {
      wx.showToast({
        title: '+1',
        icon: 'none',
      });
      bookModel.submitNewShortComment(
        this.data.bookDetail.id,
        content,
      );
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      bid
    } = options;
    wx.showLoading()

    // 请求当书籍详情、书籍点赞情况、书籍短评数组
    const detailPromise = bookModel.getBookDetail(bid);
    const likeStatusPromise = bookModel.getBookLikeInfo(bid);
    const shortCommentPromise = bookModel.getBookShortComment(bid);
    Promise.all([detailPromise, likeStatusPromise, shortCommentPromise]).then(res => {
      this.setData({
        bookDetail: res[0],
        bookLikeInfo: res[1],
        bookShortComment: res[2].comments
      });

      return Promise.resolve(res[0]);
    }).then(data => {
      let {
        publisher,
        pubdate,
        pages,
        price,
        binding,
        summary,
      } = data;
      // 摘要大于400个字，超出的部分以...显示
      summary = this.collapseSummary(400, () => {
        this.setData({
          summaryCanexpand: true,
        });
      });
      // 填充 bookEntry 内容
      this.setData({
        bookEntry: [{
          label: "出版社",
          value: publisher
        },
        {
          label: "出版年",
          value: pubdate
        },
        {
          label: "页数",
          value: pages
        },
        {
          label: "定价",
          value: price
        },
        {
          label: "精装",
          value: binding
        },
        ],
        summary,
        summary1: summary,
      }, () => {
        this.setSummaryHeight();
        wx.hideLoading()
      });
    }).catch(err => {
      wx.hideLoading()
    });
  }

})