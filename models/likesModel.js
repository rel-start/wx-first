import HTTP from '../util/http.js';

class LikesModel extends HTTP {
  /**
   * 对该期刊切换状态，喜欢或不喜欢
   * @param {String} behavior 喜欢该期刊or不喜欢
   * @param {Number} artID id
   * @param {Number} category 类型号，为100,200,300,400的一种，分别表示电影，音乐，句子，书籍
   */
  like(behavior, artID, category) {
    const url = behavior == "like" ? "/like" : "/like/cancel";
    this.request({
      url,
      method: "POST",
      data: {
        art_id: artID,
        type: category,
      }
    });
  }

  /**
   * 独立的喜欢接口调用，用于获取 fav_nums like_status
   * @param {Number} type 类型号，为100,200,300的一种，分别表示电影，音乐，句子
   * @param {Number} id id
   */
  getLikeStatic(type, id) {
    return this.request({
      url: `/classic/${type}/${id}/favor`,
    })
  }
}

export default LikesModel;