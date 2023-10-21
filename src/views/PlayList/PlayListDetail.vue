<template>
  <div ref="scroll" id="scroll">
    <div id="playlist-detail" v-if="isLoading">
      <div id="playlist-wrapper">
        <!-- 上方歌单详情 -->
        <div id="detail-wrapper">
          <!-- 歌单图片 -->
          <div id="img-wrapper">
            <img :src="playListInfo.coverImgUrl" />
          </div>
          <div id="detail">
            <!-- 标题 -->
            <div id="title">
              <div id="playlist-tag">歌单</div>
              <span>{{ playListInfo.name }}</span>
            </div>
            <!-- 歌单创建者和创建时间 -->
            <div id="create-info">
              <div id="creator-avatar">
                <img :src="playListInfo.creator.avatarUrl" />
              </div>
              <div id="creator-info">
                <span id="name">{{ playListInfo.creator.nickname }}</span>
                <span id="time">{{
                  playListInfo.createTime | timeFormat
                }}</span>
              </div>
            </div>
            <!-- 各种按钮 -->
            <div id="btn-list">
              <button id="play">
                <i class="iconfont icon-bofang"></i>
                播放全部
              </button>
              <button id="collect">
                <i class="el-icon-folder-add"></i>
                收藏({{ playListInfo.subscribedCount }})
              </button>
              <button id="share">
                <i class="iconfont icon-fenxiang"></i>
                分享({{ playListInfo.shareCount }})
              </button>
            </div>
            <!-- 标签 -->
            <div id="label">
              标签：
              <template v-if="playListInfo.tags.length !== 0">
                <span
                v-for="(t, index) in playListInfo.tags"
                :key="index"
                >{{ t }}</span
              >
              </template>
              <span v-if="playListInfo.tags.length == 0">暂无</span>
              
            </div>
            <!-- 歌曲数量，歌单播放量 -->
            <div id="amount-viewcount">
              <div id="song-amount">歌曲：{{ trackIds.length }}</div>
              <div id="viewcount">
                播放：{{ playListInfo.playCount | playCountFormat }}
              </div>
            </div>
            <!-- 简介 -->
            <div id="description">
              <input type="checkbox" id="check" />
              <div id="intro">
                <span>简介：{{ playListInfo.description || ' 暂无'}}</span>
              </div>
              <label for="check" class="uncheck" v-if="playListInfo.description">
                <i class="el-icon-caret-bottom"></i>
              </label>
              <label for="check" class="ischeck">
                <i class="el-icon-caret-top"></i>
              </label>
            </div>
          </div>
        </div>

        <!-- 歌曲列表、评论、收藏者、搜索音乐 -->
        <div id="guide">
          <div id="btns">
            <button
              @click="changeCom(0)"
              :class="{ active: componentId === 'MusicList' }"
            >
              歌曲列表
            </button>
            <button
              @click="changeCom(1)"
              :class="{ active: componentId === 'Comment' }"
            >
              评论({{ playListDynamic.commentCount }})
            </button>
            <button
              @click="changeCom(2)"
              :class="{ active: componentId === 'Collector' }"
            >
              收藏者
            </button>
          </div>
          <div id="music-search" v-if="this.componentId == 'MusicList'">
            <el-input
              placeholder="搜索音乐"
              suffix-icon="el-icon-search"
              v-model="searchSong"
              clearable
            ></el-input>
          </div>
        </div>

        <MusicList
          v-if="this.componentId == 'MusicList'"
          :trackIds="trackIds"
          :searchSong="searchSong"
        ></MusicList>
        <CommentList
          v-if="this.componentId == 'Comment'"
          :id="playListInfo.id"
          :isLogin="isLogin"
        ></CommentList>
        <Collector
          v-if="this.componentId == 'Collector'"
          :id="playListInfo.id"
        ></Collector>
      </div>
    </div>
    <el-backtop target="#scroll" :bottom="100"></el-backtop>
  </div>
</template>

<script>
import MusicList from "../../components/List/MusicList.vue";
import CommentList from "../../components/List/CommentList.vue";
import Collector from "../../components/Collector/Collector.vue";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: { MusicList, CommentList, Collector },
  data() {
    return {
      playListInfo: [],
      trackIds: [],
      playListDynamic: {},
      isLoading: false,
      componentId: "MusicList",
      searchSong: "",
    };
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  methods: {
    changeCom(val) {
      if (val == 0) {
        this.componentId = "MusicList";
      } else if (val == 1) {
        this.componentId = "Comment";
      } else if (val == 2) {
        this.componentId = "Collector";
      }
    },
    getParams() {
      console.log('当前专辑id为：',this.$route.params.id);
    },
    // 获取歌单信息
    async getPlayList(id) {
      this.isLoading = false;
      const res = await axios.get("/playlist/detail", { params: { id } });
      console.log(res.data);
      this.playListInfo = Object.freeze(res.data.playlist);
      this.trackIds = Object.freeze(res.data.playlist.trackIds);
      this.getPlayListDynamic(id);
      this.isLoading = true;
    },
    // 获取歌单动态信息
    async getPlayListDynamic(id) {
      const res = await axios.get("/playlist/detail/dynamic", {
        params: { id },
      });
      this.playListDynamic = res.data;
    },
  },
  filters: {
    timeFormat(val) {
      let data = new Date(val);
      let year = data.getFullYear();
      let month = data.getMonth() + 1;
      let day = data.getDate();
      month = month < 10 ? "0" + month : month;
      month = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
    playCountFormat(val) {
      if (val < 100000) {
        return val;
      } else {
        const playCount = Math.round(val / 10000);
        return playCount + "万";
      }
    },
  },
  created() {
    this.getPlayList(this.$route.params.id);
    this.getParams()
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-backtop{
  color: #ec4141;
}

#scroll {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  #playlist-detail {
    max-width: 1200px;
    margin: 0 auto;
    #playlist-wrapper {
      margin-top: 20px;
      #detail-wrapper {
        display: flex;
        #img-wrapper {
          width: 180px;
          height: 180px;
          cursor: pointer;
          img {
            height: 100%;
            border-radius: 5px;
            border: 1px solid #ddd;
          }
        }
        #detail {
          font-size: 14px;
          margin-left: 20px;
          max-width: 1000px;
          #title {
            display: flex;
            line-height: 24px;
            #playlist-tag {
              color: #ec4141;
              border: 1px solid #ec4141;
              padding: 0 2px;
            }
            span {
              margin-left: 10px;
              font-size: 20px;
              font-weight: bold;
            }
          }
          #create-info {
            margin: 5px 0;
            display: flex;
            #creator-avatar {
              width: 24px;
              height: 24px;
              cursor: pointer;
              img {
                width: 100%;
                border-radius: 50%;
              }
            }
            #creator-info {
              span {
                margin-left: 12px;
                font-size: 12px;
              }
              #name {
                color: #0b58b0;
                cursor: pointer;
              }
            }
          }
          #btn-list {
            margin: 5px 0;
            button {
              border: none;
              outline: none;
              height: 30px;
              padding: 4px 14px;
              border-radius: 15px;
              cursor: pointer;
            }
            #play {
              color: white;
              background-color: #ec4141;
            }
            #collect,
            #share {
              color: #373737;
              border: 1px solid #d8d8d8;
              background-color: #fff;
              margin-left: 10px;
              i {
                margin-right: 3px;
              }
            }
          }
          #label {
            line-height: 24px;
            span {
              margin-right: 10px;
            }
          }
          #amount-viewcount {
            line-height: 24px;
            display: flex;
            #viewcount {
              margin-left: 15px;
            }
          }
          #description {
            line-height: 24px;
            input {
              display: none;
              &:checked ~ .uncheck {
                display: none;
              }
              &:checked ~ .ischeck {
                display: block;
              }
              &:checked ~ #intro {
                max-height: 500px;
                white-space: normal;
              }
            }
            label {
              cursor: pointer;
              i {
                font-size: 20px;
              }
            }
            .ischeck {
              display: none;
            }
            #intro {
              width: 100%;
              max-height: 24px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              transition: all 1s linear;
              span {
                width: 100%;
              }
            }
          }
        }
      }

      #guide {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        height: 48px;
        align-items: center;
        #btns {
          button {
            border: none;
            outline: none;
            margin-right: 20px;
            background-color: #fff;
            font-size: 14px;
            cursor: pointer;
            &.active {
              font-weight: bold;
              &::after {
                content: "";
                display: block;
                height: 4px;
                width: 90%;
                margin: 0 auto;
                margin-top: 2px;
                border-radius: 2px;
                background-color: #ec4141;
              }
            }
          }
        }
        #music-search {
          ::v-deep .el-input {
            .el-input__inner {
              height: 26px;
              line-height: 26px;
              color: #676767;
              background-color: #f7f7f7;
              border-radius: 16px;
              border: 0;
            }
            .el-input__icon {
              line-height: 26px;
            }
          }
        }
      }
    }
  }
}
</style>