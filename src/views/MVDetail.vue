<template>
  <div ref="scroll" id="scroll">
    <div id="mvdetail-wrapper">
      <!-- 左侧 -->
      <div class="left">
        <!-- 后退按钮 -->
        <div id="go-back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>
          <span>返回</span>
        </div>
        <!-- mv视频 -->
        <div id="mv">
          <video :src="mvUrl" controls width="600px" height="340">
            您的浏览器不支持vedio标签。
          </video>
        </div>
        <!-- mv作者头像及姓名 -->
        <div id="artists" v-if="mvArtists">
          <img
            :src="mvArtists[0].img1v1Url + '?param=100y100'"
            @click="toArtistDetail(mvArtists[0].id)"
          />
          <span
            class="artist"
            v-for="a in mvArtists"
            @click="toArtistDetail(a.id)"
            >{{ a.name }}</span
          >
        </div>
        <!-- mv名及发布时间和播放数量 -->
        <div id="mv-info">
          <div id="name">{{ mvDetail.name }}
            <template v-if="!showDes && mvDetail.desc">
              <i class="el-icon-caret-bottom" @click="showDes = true"></i>
            </template>
            <template v-if="showDes">
              <i class="el-icon-caret-top" @click="showDes = false"></i>
            </template>
          </div>
          <div id="pubtime-plcount">
            <span>发布：{{ mvDetail.publishTime }}</span>
            <span style="margin-left: 10px"
              >播放：{{ mvDetail.playCount | playCountFormat }}次</span
            >
          </div>
        </div>
        <!-- mv简介 -->
        <div id="mv-description" :class="{isShow:showDes}" v-if="mvDetail.desc">
          <p>{{mvDetail.desc}}</p>
        </div>
        <!-- mv标签 -->
        <div id="mv-tags" v-if="mvDetail.videoGroup.length !== 0">
          <button v-for="t in mvDetail.videoGroup">{{t.name}}</button>
        </div>
        <!-- 点赞收藏 -->
        <div id="btns">
          <button v-if="!mvInfo.liked" @click="likeMV(id)">
            <i class="iconfont icon-good"></i>赞({{ mvInfo.likedCount }})
          </button>
          <button v-if="mvInfo.liked" @click="likeMV(id)">
            <i class="iconfont icon-good"></i>已赞({{ mvInfo.likedCount }})
          </button>
          <button v-if="!isSub" @click="subMV(id)">
            <i class="el-icon-folder-add"></i>收藏({{mvDetail.subCount}})
          </button>
          <button v-if="isSub" @click="subMV(id)">
            <i class="el-icon-folder-checked"></i>已收藏({{mvDetail.subCount}})
          </button>
        </div>

        <!-- 评论 -->
        <div id="comment">
          <span id="txt">评论</span>
          <span id="playcount">({{ mvDetail.commentCount }})</span>
          <CommentList :id="id" type="mv" :isLogin="isLogin"></CommentList>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right">
        <span id="text">相关推荐</span>
        <div id="relevent-mv">
          <ul>
            <li v-for="v in simiMV">
              <div id="remv-wrapper">
                <div id="playcount">
                  <i class="iconfont icon-24gl-play"></i
                  >{{ v.playCount | playCountFormat }}
                </div>
                <img :src="v.cover" @click="toMVDetail(v.id)" />
                <div id="duration">
                  {{ v.duration | durationFormat }}
                </div>
              </div>
              <div id="remv-info">
                <div id="title" @click="toMVDetail(v.id)">
                  <span> {{ v.name }}</span>
                </div>
                <div id="artist">
                  by<span @click="toArtistDetail(v.artists[0].id)">
                    {{ v.artists[0].name }}</span
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
      mvDetail: [],
      mvInfo: {},
      mvUrl: "",
      isSub: false,
      simiMV: [],
      showDes:false,
    };
  },
  computed: {
    mvArtists() {
      return this.mvDetail.artists;
    },
    ...mapState(["isLogin"]),
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  watch: {
    id() {
      this.getMvDetail();
      this.getMvDate();
      this.getMvUrl();
      this.getSimilarMv();
    },
  },
  methods: {
    // 获取 mv 数据
    async getMvDetail() {
      const res = await get("mv/detail", { mvid: this.id });
      if (res.code !== 200) return;
      console.log("detail", res);
      this.mvDetail = Object.freeze(res.data);
      this.isSub = res.subed;
    },
    // 获取 mv 点赞转发评论数数据
    async getMvDate() {
      const res = await get("/mv/detail/info", { mvid: this.id });
      if (res.code !== 200) return;
      console.log("info", res);
      this.mvInfo = Object.freeze(res);
    },
    // 获取 mv 地址
    async getMvUrl() {
      const res = await get("/mv/url", { id: this.id });
      if (res.code !== 200) return;
      console.log("url", res);
      this.mvUrl = Object.freeze(res.data.url);
    },
    // 获取相似mv
    async getSimilarMv() {
      const res = await get("/simi/mv", { mvid: this.id });
      if (res.code !== 200) return;
      console.log("simiMV", res);
      this.simiMV = Object.freeze(res.mvs);
    },
    // 点赞mv
    likeMV(id) {
      if (!this.isLogin) {
        this.$message.error('需要登录！');
      }
    },
    // 收藏mv
    subMV(id) {
      if (!this.isLogin) {
        this.$message.error('需要登录！');
      }
    },
    toArtistDetail(id) {
      this.$router.push(`/artistdetail/${id}`);
    },
    toMVDetail(id) {
      this.$router.push(`/mvdetail/${id}`);
    },
  },
  filters: {
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
    this.getMvDetail();
    this.getMvDate();
    this.getMvUrl();
    this.getSimilarMv();
  },
};
</script>

<style lang="less" scoped>
#scroll {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
#mvdetail-wrapper {
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

  #artists {
    margin-top: 10px;
    height: 50px;
    line-height: 50px;
    display: flex;
    img {
      height: 100%;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
    }
    .artist {
      color: #676767;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #373737;
      }
    }
    .artist:not(:first-of-type)::before {
      content: "/";
      font-size: 12px;
      margin: 0 5px;
    }
  }
  #mv-info {
    margin-top: 20px;
    user-select: none;
    #name {
      color: #000;
      font-size: 20px;
      font-weight: bold;
    }
    #pubtime-plcount {
      margin-top: 10px;
      color: #cfcfcf;
    }
  }
  #mv-description{
    margin-top: 15px;
    line-height: 20px;
    text-indent: 2em;
    display: none;
    &.isShow{
      display: block;
    }
  }
  #mv-tags{
    margin-top: 10px;
    button{
      outline: none;
      border: none;
      background-color: #f7f7f7;
      color: #363636;
      margin-right: 5px;
      padding: 2px 8px;
      border-radius: 10px;
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
  #relevent-mv {
    ul {
      li {
        margin-bottom: 20px;
        display: flex;
        overflow-x: hidden;
        #remv-wrapper {
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
            color: rgb(255, 255, 255);
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
        #remv-info {
          margin-left: 10px;
          position: relative;
          width: 100%;
          #title {
            font-size: 14px;
            position: absolute;
            top: 15px;
            cursor: pointer;
          }
          #artist {
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