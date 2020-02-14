Component({
  properties: {
    index: {
      type: String,
      observer(newVal, oldVal, changePath) {
        // 传入属性 index 补0
        this.setData({
          index: this.add0(newVal)
        });
      }
    }
  },

  data: {
    year: 0,//年。2020
    month: "",//月。二月
  },

  methods: {
    // 补0
    add0(num) {
      if (num.length == 1) {
        return '0' + num;
      }
      return num;
    }
  },

  lifetimes: {
    attached() {
      // data.year data.month 设置为当前时间
      const now = new Date();
      const month = now.getMonth();
      const strMonth = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

      this.setData({
        year: now.getFullYear(),
        month: strMonth[month],
      });

    }
  }
})