Component({
  properties: {
    title: String, // 当前专辑标题
    first: Boolean, // 当前专辑是否是第一张专辑（最老）
    latest: Boolean // 当前专辑是否是最后一张专辑（最新）
  },

  data: {
    leftSrc: './images/triangle@left.png', // 切换专辑组件left按钮 可点击状态的图片路径
    disLeftSrc: './images/triangle.dis@left.png', // 切换专辑组件left按钮 no点击状态的图片路径
    rightSrc: './images/triangle@right.png', // 切换专辑组件right按钮 可点击状态的图片路径
    disRightSrc: './images/triangle.dis@right.png', // 切换专辑组件right按钮 no点击状态的图片路径
  },

  methods: {
    // 上张专辑
    getPrevClassic() {
      this.triggerEvent('changeClassic', {
        type: 'prev'
      }, {});
    },
    // 下张专辑
    getNextClassic() {
      this.triggerEvent('changeClassic', {
        type: 'next'
      }, {});
    },
  }
})