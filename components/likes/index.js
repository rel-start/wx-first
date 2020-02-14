Component({
  properties: {
    strCount: Number, //当前专辑的点赞（喜欢）次数。页面上显示的变量：1000+会被处理成1k+，2000+会被处理成2k+
    count: Number, //当前专辑的点赞（喜欢）次数
    like: Boolean, //当前用户是否喜欢专辑
    readOnly: Boolean, //是否只读
  },

  data: {
    yesSrc: "./images/likes-on.png", // like小图标 yes的路径
    noSrc: "./images/likes-default.png", //like小图标 no的路径
  },

  methods: {
    /**切换like图标 */
    onLike(e) {
      let {
        like,
        count,
        readOnly,
      } = this.properties;
      if (readOnly) return;

      count = like ? count - 1 : count + 1;
      let strCount = count;
      // 如果count大于1000，就显示1k+；2000:2k+
      if (count >= 1000) {
        strCount = String(count).slice(0, 1) + "k+";
      }

      this.setData({
        strCount,
        count,
        like: !like,
      });
      //激活
      let behavior = !like ? 'like' : 'cancel';
      this.triggerEvent('like', {
        behavior,
      }, {});
    }
  }
})