import LikeModel from "../../../models/likesModel.js";
const likeModel = new LikeModel();

Component({
  properties: {
    bookLikeInfo: Object, //当前书籍点赞情况
    bookShortComment: Object, //当前书籍短评数组
    isposting: Boolean, //是否显示隐藏层（真实可以评论的input）。true: 显示,false: 隐藏
  },

  methods: {
    // 切换是否喜欢当前图书
    onLike(ev) {
      const {
        behavior
      } = ev.detail;
      const {
        bookLikeInfo: {
          id
        }
      } = this.properties;
      likeModel.like(behavior, id, 400);
    },
    // 显示或隐藏 layer层。真实可以评论的input
    showOrHideLayer() {
      this.setData({
        isposting: !this.data.isposting
      });
    },
    // 添加短评。将tag组件的content传递给book-detail页面
    passContentFromTag(event) {
      let {content,value} = event.detail;
      content = content ? content.trim() : value.trim();

      this.triggerEvent('add', {
        content
      });
    },
  }
})