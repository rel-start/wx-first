import LikesModel from '../../models/likesModel.js';
let likesModel = new LikesModel();

const likeCompBeh = Behavior({
  data: {
    currentClassic: null, //当前期刊
  },
  methods: {
    // 切换是否喜欢当前期刊
    onLike(ev) {
      const {
        behavior
      } = ev.detail;
      const {
        id,
        type
      } = this.data.currentClassic;
      likesModel.like(behavior, id, type);
    },
  },
});

export default likeCompBeh;