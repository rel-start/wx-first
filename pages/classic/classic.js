import likeCompBeh from '../../components/behaviors/likeCom-beh.js';
import LikesModel from '../../models/likesModel.js';
let likesModel = new LikesModel();
import ClassicModel from '../../models/classicModel.js';
let classicModel = new ClassicModel();


Component({
  behaviors: [likeCompBeh],
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    // currentClassic: null, //当前期刊 (likeCom-beh.js)
    latest: true, //是否是最新期刊
    first: false, //是否是第一期刊
    favNums: 0, //点赞数
    likeStatus: 0, //当前用户是否喜欢该期刊 0:不喜欢 1:喜欢
    _touchStartX: 0, //开始触摸的X
    _touchEndX: 0, //结束触摸的X
  },

  methods: {

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
  },

  pageLifetimes: {
    show() {
      wx.showLoading()
      classicModel.getLatest().then(async (data) => {
        this.setData({
          currentClassic: data,
          latest: await classicModel.isLatest(data.index),
          first: classicModel.isFirst(data.index),
          favNums: data.fav_nums,
          likeStatus: data.like_status,
        })
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
      });
    }
  },
})