<template>
  <div ref="scroll" id="scroll">
    <div id="video-wrapper">
      <!-- 左侧 -->
      <div class="left">
        <!-- 后退按钮 -->
        <div id="go-back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>
          <span>返回</span>
        </div>
        <!-- video视频 -->
        <div id="video">
          <video :src="videoUrl" controls width="600px" height="340">
            您的浏览器不支持vedio标签。
          </video>
        </div>
        <!-- 视频作者头像及姓名 -->
        <div id="creator-wrapper" v-if="videoCreator">
          <div id="creator-info">
            <img
              :src="videoCreator.avatarUrl + '?param=100y100'"
              @click="toUserDetail(videoCreator.userId)"
            />
            <span class="creator" @click="toUserDetail(videoCreator.userId)">{{
              videoCreator.nickname
            }}</span>
          </div>
          <div id="follow">
            <button :class="{ isfollow: followed }" @click="follow">
              <template v-if="!followed">
                <i class="el-icon-plus"></i> 关注
              </template>
              <template v-else> <i class="el-icon-check"></i> 已关注 </template>
            </button>
          </div>
        </div>
        <!-- 视频标题及发布时间和播放数量 -->
        <div id="video-info">
          <div id="title">
            {{ videoDetail.title }}
            <template v-if="!showDes">
              <i class="el-icon-caret-bottom" @click="showDes = true"></i>
            </template>
            <template v-if="showDes">
              <i class="el-icon-caret-top" @click="showDes = false"></i>
            </template>
          </div>
          <div id="pubtime-plcount">
            <span>发布：{{ videoDetail.publishTime | timeFormat }}</span>
            <span style="margin-left: 10px"
              >播放：{{ videoDetail.playTime | playCountFormat }}次</span
            >
          </div>
        </div>
        <!-- 视频标签 -->
        <div id="video-tags">
          <button v-for="t in videoDetail.videoGroup">{{ t.name }}</button>
        </div>
        <!-- 视频简介 -->
        <div id="video-description" :class="{ isShow: showDes }">
          <p>{{ videoDetail.description }}</p>
        </div>
        <!-- 点赞收藏 -->
        <div id="btns">
          <button v-if="!videoInfo.liked" @click="likeVideo">
            <i class="iconfont icon-good"></i>赞({{ videoInfo.likedCount }})
          </button>
          <button v-if="videoInfo.liked" @click="likeVideo">
            <i class="iconfont icon-good"></i>已赞({{ videoInfo.likedCount }})
          </button>
          <button @click="subVideo" v-if="!isSub">
            <i class="el-icon-folder-add"></i>收藏({{
              videoDetail.subscribeCount
            }})
          </button>
          <!-- 视频接口无法获取是否收藏的数据，这个功能图一乐 -->
          <button @click="subVideo" v-if="isSub">
            <i class="el-icon-folder-checked"></i>已收藏({{
              videoDetail.subscribeCount
            }})
          </button>
        </div>

        <!-- 评论 -->
        <div id="comment">
          <span id="txt">评论</span>
          <span id="playcount">({{ videoDetail.commentCount }})</span>
          <CommentList :id="id" type="video" :isLogin="isLogin"></CommentList>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right">
        <span id="text">相关推荐</span>
        <div id="relevent-video">
          <ul>
            <li v-for="v in relVideo">
              <div id="revideo-wrapper">
                <div id="playcount">
                  <i class="iconfont icon-24gl-play"></i
                  >{{ v.playTime | playCountFormat }}
                </div>
                <img :src="v.coverUrl" @click="toVideoDetail(v.vid)" />
                <div id="duration">
                  {{ v.durationms | durationFormat }}
                </div>
              </div>
              <div id="revideo-info">
                <div id="title" @click="toVideoDetail(v.vid)">
                  <span> {{ v.title }}</span>
                </div>
                <div id="creator">
                  by<span @click="toUserDetail(v.creator[0].userId)">
                    {{ v.creator[0].userName }}</span
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "../request/index";
import { mapState } from "vuex";
import CommentList from "../components/List/CommentList.vue";
export default {
  components: { CommentList },
  data() {
    return {
      videoDetail: {},
      videoInfo: {},
      videoUrl: "",
      relVideo: [],
      showDes: false,
      isSub: false,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    videoCreator() {
      return this.videoDetail.creator;
    },
    followed() {
      return this.videoDetail.creator.folled;
    },
    ...mapState(["isLogin"]),
  },
  watch: {
    id(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getVideoDetail();
        this.getVideoInfo();
        this.getVideoUrl();
        this.getReleVideo();
      }
    },
  },
  methods: {
    // 获取视频详情
    async getVideoDetail() {
      const res = await get("/video/detail", { id: this.id });
      console.log("videoDetail", res);
      this.videoDetail = Object.freeze(res.data);
    },
    // 获取视频点赞转发评论数数据
    async getVideoInfo() {
      const res = await get("/video/detail/info", { vid: this.id });
      console.log("videoInfo", res);
      this.videoInfo = Object.freeze(res);
    },
    // 获取视频播放地址
    async getVideoUrl() {
      const res = await get("/video/url", { id: this.id });
      console.log("videoUrl", res);
      this.videoUrl = res.urls[0].url;
    },
    // 获取视频相关推荐
    async getReleVideo() {
      const res = await get("/related/allvideo", { id: this.id });
      console.log("releventVideo", res);
      this.relVideo = res.data;
    },
    // 关注
    follow() {},
    // 给视频点赞
    likeVideo() {
      if (!this.isLogin) {
        this.$message.error("需要登录！");
      }
    },
    // 收藏视频
    subVideo() {
      if (!this.isLogin) {
        this.$message.error("需要登录！");
      }
    },
    // 跳转到相应视频详情页
    toVideoDetail(id) {
      this.$router.push(`/videodetail/${id}`);
    },
    toUserDetail(id) {
      this.$router.push(`/userdetail/${id}`);
    },
  },
  filters: {
    timeFormat(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() * 1 + 1;
      let day = date.getDay();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return `${year}-${month}-${day}`;
    },
    playCountFormat(val) {
      if (val > 10000) {
        return Math.floor(val / 10000) + "万";
      } else {
        return val;
      }
    },
    durationFormat(val) {
      let date = new Date(val);
      let min = date.getMinutes();
      let sec = date.getSeconds();
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      return `${min}:${sec}`
    },
  },
  created() {
    this.getVideoDetail();
    this.getVideoInfo();
    this.getVideoUrl();
    this.getReleVideo();
  },
};
</script>

<style lang="less" scoped>
#scroll {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
#video-wrapper {
  width: 1200px;
  margin: 0 auto;
  display: flex;
}
.left {
  #go-back {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    span {
      margin-left: 10px;
    }
  }

  #creator-wrapper {
    margin-top: 10px;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    #creator-info {
      display: flex;
      img {
        height: 100%;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }
      .creator {
        color: #676767;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #373737;
        }
      }
    }
    #follow {
      button {
        outline: none;
        border: none;
        background-color: #fcf4f4;
        color: #ff3a3a;
        height: 30px;
        width: 80px;
        border-radius: 15px;
        cursor: pointer;
      }
    }
  }
  #video-info {
    margin-top: 20px;
    user-select: none;
    #title {
      color: #000;
      font-size: 20px;
      font-weight: bold;
    }
    #pubtime-plcount {
      margin-top: 10px;
      color: #cfcfcf;
    }
  }
  #video-tags {
    margin-top: 10px;
    button {
      outline: none;
      border: none;
      background-color: #f7f7f7;
      color: #363636;
      margin-right: 5px;
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  #video-description {
    margin-top: 15px;
    line-height: 20px;
    text-indent: 2em;
    display: none;
    &.isShow {
      display: block;
    }
  }
  #btns {
    margin-top: 30px;
    button {
      border: 1px solid #d8d8d8;
      background-color: rgba(0, 0, 0, 0);
      font-size: 14px;
      height: 30px;
      padding: 0 10px;
      border-radius: 15px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        background-color: #f2f2f2;
      }
      i {
        margin-right: 5px;
      }
    }
  }

  #comment {
    margin-top: 30px;
    #txt {
      font-size: 20px;
      font-weight: bold;
      margin-right: 5px;
      user-select: none;
    }
    #playcount {
      color: #9f9f9f;
      user-select: none;
    }
  }
}

.right {
  width: 100%;
  margin-left: 40px;
  #text {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    cursor: default;
  }
  #relevent-video {
    ul {
      li {
        margin-bottom: 20px;
        display: flex;
        overflow-x: hidden;
        #revideo-wrapper {
          width: 240px;
          position: relative;
          img {
            border-radius: 5px;
            width: 100%;
            object-fit: cover;
            cursor: pointer;
          }
          #playcount{
            position: absolute;
            right: 3px;
            top: 3px;
            color: rgb(236, 236, 236);
            text-shadow: 0 0 1px #000;
            i{
              font-size: 12px;
              margin-right: 3px;
            }
          }
          #duration{
            position: absolute;
            right: 3px;
            bottom: 3px;
            color: white;
            text-shadow: 0 0 1px #000;
          }
        }
        #revideo-info {
          margin-left: 10px;
          position: relative;
          width: 100%;
          #title {
            font-size: 14px;
            position: absolute;
            top: 15px;
            cursor: pointer;
          }
          #creator {
            color: #9f9f9f;
            position: absolute;
            bottom: 15px;
            cursor: default;
            span {
              cursor: pointer;
              &:hover {
                color: #676767;
              }
            }
          }
        }
      }
    }
  }
}
</style>