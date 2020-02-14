import paginationBeh from '../../behaviors/pagination-beh.js';
import {
  wxPromise
} from '../../../util/http.js';
import MyModel from '../../../models/myModel.js';
const myModel = new MyModel();

Component({
  behaviors: [paginationBeh],
  properties: {
    more: { // 更多喜欢期刊
      type: Boolean,
      observer: 'loadMore'
    }
  },

  data: {
    userInfo: undefined, // 用户信息
    isAuthorized: false, // 是否已授权。true: 已授权, false: 未授权
    // likeCards: [], // 当前用户喜欢的所有期刊

  },

  methods: {
    // 下啦加载更多数据
    async loadMore() {
      //服务器无数据了，就没必要请求了
      if (!this.hasMoreLikes()) return;

      try {
        this.loadedForBottom();
        const res = await myModel.getFavorClassic({
          start: this.getCurrentStart(),
        });
        this.setMoreData(res);
        this.unLoadedForBottom();
      } catch (err) {
        this.unLoadedForBottom();
      }
    },
    // 点击获取用户信息
    onGetUserInfo(event) {
      const {
        detail: {
          userInfo
        }
      } = event;
      if (userInfo) {
        this.setData({
          userInfo,
          isAuthorized: true,
        });
      }
    },

    // 用户已授权
    async userAuthorized() {
      const data = await wxPromise(wx.getSetting);
      if (data.authSetting['scope.userInfo']) {
        const res = await wxPromise(wx.getUserInfo);
        const {
          userInfo
        } = res;
        this.setData({
          userInfo,
          isAuthorized: true,
        });
      } else {
        this.setData({
          isAuthorized: false,
        });
      }
    },

    // 跳转到classic页面
    onJumpToClassicPage() {
      wx.switchTab({
        url: "/pages/classic/classic"
      })
    },
  },

  lifetimes: {
    attached() {
      this.userAuthorized();
    },
  },

  pageLifetimes: {
    async show() {
      try {
        wx.showLoading()
        const currentData = await myModel.getFavorClassic();
        this.setData({
          currentData,
        });
        wx.hideLoading()
      } catch (err) {
        wx.hideLoading()
      }
    }
  },
})