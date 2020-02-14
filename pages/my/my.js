Page({

  data: {
    more: false, // 更多喜欢期刊
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  onReachBottom() {
    const {
      more
    } = this.data;
    this.setData({
      more: !more,
    });

  },
})