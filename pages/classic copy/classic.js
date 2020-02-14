import ClassicModel from '../../models/classicModel.js';
import LikesModel from '../../models/likesModel.js';

let classicModel = new ClassicModel();
let likesModel = new LikesModel();

Page({
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    currentClassic: null, //当前期刊
    latest: true, //是否是最新期刊
    first: false, //是否是第一期刊
    favNums: 0, //点赞数
    likeStatus: 0, //当前用户是否喜欢该期刊 0:不喜欢 1:喜欢
    _musicCmp: null, //用于储存music-cmp组件
    _touchStartX: 0, //开始触摸的X
    _touchEndX: 0, //结束触摸的X
  },

  // 切换是否喜欢当前期刊
  onLike(ev) {
    const {
      behavior
    } = ev.detail;
    const {
      currentClassic: {
        id,
        type
      }
    } = this.data;
    likesModel.like(behavior, id, type);
  },

  // 切换期刊
  changeClassic(ev) {
    const {
      type
    } = ev.detail;
    // 当前期刊的index
    const {
      currentClassic: {
        index
      },
      first,
      latest,
    } = this.data;
    // 已经是第一张专辑或最后一张专辑 就不进行下面的请求
    if (type === 'next' && latest || type === 'prev' && first) return;
    // 请求classic专辑的数据。这个数据有可能是缓存中的数据（点赞的数据需要独立处理）
    classicModel.getClassic(index, type).then(async (data) => {
      this.setData({
        currentClassic: data,
        latest: await classicModel.isLatest(data.index),
        first: classicModel.isFirst(data.index)
      });
      return Promise.resolve(data);
    }).then(data => {
      // 处理独立的点赞数据
      likesModel.getLikeStatic(data.type, data.id).then(data => {
        this.setData({
          favNums: data.fav_nums,
          likeStatus: data.like_status,
        });
      });
      // 调用music-cmp组件的方法：用于更新当前播放按钮状态
      const {
        data: {
          _currentAudioSrc,
        },
      } = this.data._musicCmp;
      this.data._musicCmp._currentPlayButtonStatus(data.url ? data.url : _currentAudioSrc);
    })

  },

  // 专辑区域 手指触碰开始
  classicTouchStart(event) {
    const {
      pageX
    } = event.changedTouches[0];
    this.setData({
      _touchStartX: pageX,
    });
  },
  // 专辑区域 手指触摸动作被打断，如来电提醒，弹窗
  classicTouchCancel() {
    this.setData({
      _touchStartX: 0,
    });
  },
  // 专辑区域 手指触碰结束
  classicTouchEnd(event) {
    const {
      _touchStartX,
    } = this.data;
    const diff = event.changedTouches[0].pageX - _touchStartX;

    this.setData({
      _touchStartX: 0,
    });

    if (diff < 120 && diff > -120) {
      return;
    }
    if (diff > 120) { // 上一张专辑
      this.changeClassic({
        detail: {
          type: 'prev'
        }
      })
      return;
    }
    if (diff < -120) { //下一张专辑
      this.changeClassic({
        detail: {
          type: 'next'
        }
      })
      return;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classicModel.getLatest().then(async (data) => {
      this.setData({
        currentClassic: data,
        latest: await classicModel.isLatest(data.index),
        first: classicModel.isFirst(data.index),
        favNums: data.fav_nums,
        likeStatus: data.like_status,
      })
    })

    // 将music-cmp组件存到this.data中
    this.setData({
      _musicCmp: this.selectComponent("#music-cmp"),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})