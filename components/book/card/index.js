Component({
  externalClasses: ['ty-booklist__card'],
  /**
   * 组件的属性列表
   */
  properties: {
    book: Object, //热门books中的某个数据
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 通过BookID跳转到详情页
    goToDetailByBookID() {
      const {
        book: {
          id,
        },
      } = this.properties;

      wx.navigateTo({
        url: `/pages/book-detail/book-detail?bid=${id}`,
      })
    }
  }
})