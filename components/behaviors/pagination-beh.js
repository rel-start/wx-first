const paginationBeh = Behavior({
  data: {
    currentData: [], // 当前的books数组
    total: Number.MAX_SAFE_INTEGER, // books的_total
    isLoadingForBottom: false, // 是否加载数据，用于触底
    isInvalidRequest: false, // 是否是无效请求，就是有次请求回来空数组
  },

  methods: {
    setMoreData(newData) {
      // 如果请求的数据为[]，下次就不能在法无效请求了
      if (newData.length === 0) {
        this.setData({
          isInvalidRequest: true,
        })
      }
      const { currentData } = this.data;
      const tempArray = currentData.concat(newData);

      this.setData({
        currentData: tempArray,
      });
    },

    getCurrentStart() {
      return this.data.currentData.length;
    },

    setTotal(total) {
      this.setData({
        total,
      });
    },

    hasMoreLikes(){
      if (this.data.isInvalidRequest) return false;
      return true;
    },

    hasMoreBooks() {
      const { currentData, total } = this.data;
      if (currentData.length >= total) {
        return false;
      }
      return true;
    },

    // 初始化状态 books列表
    initializationBooks() {
      this.setData({
        searching: true,
        _keywords: '',
        _isShowSearchedBooks: false,
        total: Number.MIN_SAFE_INTEGER,
        // currentBooks: [],
        noResult: false,
      });
    },
    initializationLikes(){
      this.setData({
        isInvalidRequest: false,
        currentBooks: [],
      });
    },

    loadedForBottom() {
      this.setData({
        isLoadingForBottom: true
      });
    },
    unLoadedForBottom() {
      this.setData({
        isLoadingForBottom: false
      });
    },
  },
});

export default paginationBeh;