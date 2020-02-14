Component({
  externalClasses: ['mclass'],
  properties: {
    content: String, //当前tag的内容
    nums: Number, //当前tag的点赞数
    category: {
      type: Number,
      value: 1
    }, // tag的类型。1:默认  2:椭圆
  },
  methods: {
    // 通过tap事件为父级组件传递 content
    passParamsByTap(){
      const {content} = this.properties;
      this.triggerEvent('tapping', {
        content,
      });
    }
  }
})