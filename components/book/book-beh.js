const bookBeh = Behavior({
  data: {
    searching: false, // 是否是显示search组件
    isShowSearchedBooks: false, //是否显示搜索的book
  },
  methods: {
    // 显示或隐藏search组件
    switchSearchComp(event) {
      const {
        detail: {
          searching
        }
      } = event;
      this.setData({
        searching,
        isShowSearchedBooks: false,
      })
    },
  }
});

export default bookBeh;