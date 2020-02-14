import classicBeh from '../classic-beh.js';
const audio = wx.getBackgroundAudioManager();
Component({
  options: {
    pureDataPattern: /^_/,
  },
  behaviors: [classicBeh],
  properties: {
    musicSrc: String,
    musicTitle: String,
  },

  data: {
    isplaying: false, //是否在播放音乐
    playSrc: './images/music@play.png', //按钮 播放状态
    pauseSrc: './images/music@pause.png', //按钮 暂停状态
    _currentAudioSrc: null, // 当前正在播放的音乐路径
  },

  lifetimes: {
    attached() {
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
    // 1.切换专辑 父组件传入musicSrc
    // 2.点击播放 audio对象的src=musicSrc
    // 3.切换专辑 调用_currentPlayButtonStatus里面的url 请求数据data.url赋值给子组件的_currentAudioSrc
    //  - _currentAudioSrc: audio.src 或者是 当前专辑的url

    /**
     * 当前播放按钮状态
     * @param {String} url 音乐路径。默认为当前正在播放音乐的audio.src，第一未传入src时未undefined
     */
    _currentPlayButtonStatus(url) {
      this.setData({
        _currentAudioSrc: url,
      });
      // 如果当前正在播放音乐，并且正在播放音乐的曲目与切换期刊的音乐是同一首，那么isplaying=true
      if (audio.paused === false && audio.src === url) {
        this.setData({
          isplaying: true,
        });
        return;
      }
      this.setData({
        isplaying: false,
      });
    },

    /**
     * 监控播放按钮 (onPlay onPause onStop onEnded) 手机自带的总控开关
     */
    _monitorSwitch() {
      audio.onPlay(() => {
        this._currentPlayButtonStatus(this.data._currentAudioSrc);
      });
      // [BUG]:当前专辑并非是播放音乐的专辑，手机自带的暂停开启音乐会导致播放按钮图标显示错误
      audio.onPause(() => {
        this._currentPlayButtonStatus(this.data._currentAudioSrc);
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