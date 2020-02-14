import classicBeh from '../classic-beh.js';
const audio = wx.getBackgroundAudioManager();
Component({
  behaviors: [classicBeh],
  properties: {
    musicSrc: String, // music路径
    musicTitle: String, // music标题
  },

  data: {
    isplaying: false, //是否在播放音乐
    playSrc: './images/music@play.png', //按钮 播放状态
    pauseSrc: './images/music@pause.png', //按钮 暂停状态
  },

  lifetimes: {
    attached() {
      this._currentPlayButtonStatus();
      this._monitorSwitch();
    }
  },


  methods: {
    /**
     * 暂停或播放音乐
     */
    playOrPauseMusic() {
      const {
        musicSrc,
        musicTitle,
        isplaying,
        _audio,
      } = this.data;


      this.setData({
        isplaying: !isplaying
      });
      // 播放音乐
      if (!isplaying) {
        audio.title = musicTitle;
        audio.src = musicSrc;
      } else {
        audio.pause();
      }

    },

    /**
     * 当前播放按钮状态
     */
    _currentPlayButtonStatus() {
      // 如果音乐是暂停状态的话就将播放按钮设置为暂停图片
      if (audio.paused) {
        this.setData({
          isplaying: false,
        });
        return;
      }

      // 对象audio的src等于新传入音乐的话就将播放按钮设置为播放图片
      if (audio.src === this.properties.musicSrc) {
        this.setData({
          isplaying: true,
        });
      }
    },

    /**
     * 监控播放按钮 (onPlay onPause onStop onEnded) 手机自带的总控开关
     */
    _monitorSwitch() {
      audio.onPlay(() => {
        this._currentPlayButtonStatus();
      });
      audio.onPause(() => {
        this._currentPlayButtonStatus();
      });
      audio.onStop(() => {
        this._currentPlayButtonStatus();
      });
      audio.onEnded(() => {
        this._currentPlayButtonStatus();
      });
    }
  }
})