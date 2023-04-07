<template>
  <div id="album-wrapper">
    <div id="album-detail" v-if="isShow">
      <div id="head">
        <!-- 图片 -->
        <div id="album-img">
          <img v-lazy="albumInfo.picUrl + '?param=300y300'" />
        </div>
        <div id="description">
          <!-- 顶 -->
          <div id="d-head">
            <div id="identify">专辑</div>
            <span>{{ albumInfo.name }}</span>
          </div>
          <!-- 中 -->
          <div id="d-middle">
            <div class="btn" id="play-all">
              <i class="iconfont icon-bofang"></i>
              播放全部
            </div>
            <div class="btn collect" v-if="!albumDetail.isSub">
              <i class="el-icon-folder-add"></i>
              收藏({{ albumDetail.subCount }})
            </div>
            <div class="btn collect" v-else>
              <i class="el-icon-folder-checked"></i>
              已收藏({{ albumDetail.subCount }})
            </div>
          </div>
          <!-- 底 -->
          <div id="d-foot">
            <div id="artists">
              歌手：
              <span
                class="singer"
                v-for="(a, index) in albumInfo.artists"
                :key="index"
                @click="toArtistDetail(a.id)"
                >{{ a.name }}</span
              >
            </div>
            <div id="publish-time">
              时间：{{ albumInfo.publishTime | timeFormat }}
            </div>
          </div>
        </div>
      </div>

      <div id="switch">
        <div id="btns">
          <button
            :class="{ active: component == 'musicList' }"
            @click="component = 'musicList'"
          >
            歌曲列表
          </button>
          <button
            :class="{ active: component == 'commentList' }"
            @click="component = 'commentList'"
          >
            评论({{ albumDetail.commentCount }})
          </button>
          <button
            :class="{ active: component == 'albumDetails' }"
            @click="component = 'albumDetails'"
          >
            专辑详情
          </button>
        </div>
        <!-- <div id="music-search" v-if="this.component == 'musicList'">
          <el-input
            placeholder="搜索音乐"
            suffix-icon="el-icon-search"
            v-model="searchSong"
            clearable
          ></el-input>
        </div> -->
      </div>

      <MusicList v-if="component == 'musicList'" :songs="songs"></MusicList>
      <CommentList
        v-if="component == 'commentList'"
        :id="albumInfo.id"
        :isLogin="isLogin"
        type="album"
      ></CommentList>
      <div id="album-intro" v-if="component == 'albumDetails'">
        <div id="title">专辑介绍</div>
        <!-- <p id="content" v-text="albumInfo.description"></p> -->
        <div id="content">
          <p v-for="(item, index) in description" :key="index">
          {{ item }}
        </p>
        </div>
         
      </div>
    </div>

    <el-backtop target="#album-wrapper"></el-backtop>
  </div>
</template>

<script>
import { get } from "../request/index";
import { mapState } from "vuex";
import CommentList from "../components/List/CommentList.vue";
import MusicList from "../components/List/MusicList.vue";
export default {
  components: { CommentList, MusicList },
  data() {
    return {
      songs: [],
      albumInfo: {},
      albumDetail: {},
      isShow: true,
      searchSong: "",
      component: "musicList",
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    description(){
      return this.albumInfo.description.split('\n')
    },
    ...mapState(["isLogin"]),
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
  },
  methods: {
    async getAlbumSongs(id) {
      this.isShow = false;
      const res = await get("/album", { id });
      if (res.code !== 200) return;
      console.log(res);
      this.albumInfo = Object.freeze(res.album);
      this.songs = Object.freeze(res.songs);
      this.isShow = true;
    },
    async getAlbumDetail(id) {
      const res = await get("/album/detail/dynamic", { id });
      if (res.code !== 200) return;
      console.log(res);
      this.albumDetail = Object.freeze(res);
    },
    // 跳转到歌手页面
    toArtistDetail(id){
      this.$router.push(`/artistdetail/${id}`)
    }
  },
  created() {
    this.getAlbumSongs(this.id);
    this.getAlbumDetail(this.id);
  },
};
</script>

<style lang="less" scoped>


#album-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  #album-detail {
    max-width: 1200px;
    min-width: 800px;
    margin: 0 auto;
    #head {
      margin-top: 30px;
      display: flex;
      width: 100%;
      #album-img {
        width: 180px;
        height: 180px;
        img {
          height: 100%;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
      }
      #description {
        margin-left: 30px;
        #d-head {
          display: flex;
          align-items: center;
          #identify {
            height: 20px;
            line-height: 20px;
            border: 1px solid #ec4141;
            padding: 0 10px;
            border-radius: 2px;
            font-size: 13px;
            color: #ec4141;
          }
          span {
            margin-left: 10px;
            font-size: 20px;
            font-weight: bold;
          }
        }
        #d-middle {
          display: flex;
          align-items: center;
          margin-top: 10px;
          .btn {
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 15px;
            cursor: pointer;
          }
          #play-all {
            color: white;
            background-color: #ec4141;
            &:hover {
              background-color: #cc3232;
            }
          }
          .collect {
            border: 1px solid #d8d8d8;
            margin-left: 10px;
            &:hover {
              background-color: #f2f2f2;
            }
          }
        }
        #d-foot {
          margin-top: 20px;
          font-size: 14px;
          user-select: none;
          #artists {
            display: flex;
            .singer {
              display: flex;
              cursor: pointer;
              color: #507daf;
              &:hover {
                color: #0b58b0;
              }
              &:not(:first-child)::before {
                content: "/";
                color: rgb(148, 148, 148);
                padding: 0 5px;
                cursor: default;
              }
            }
          }
          #publish-time {
            margin-top: 5px;
          }
        }
      }
    }

    #switch {
      margin-top: 30px;
      #btns {
        button {
          border: none;
          background-color: rgba(0, 0, 0, 0);
          font-size: 14px;
          cursor: pointer;
          &:not(:first-child) {
            margin-left: 15px;
          }
          &.active {
            font-weight: bold;
            &::after {
              content: "";
              display: block;
              width: 80%;
              height: 3px;
              background-color: #ec4141;
              margin: 3px auto;
              border-radius: 2px;
            }
          }
        }
      }
      /* #music-search {
        ::v-deep .el-input {
          .el-input__inner {
            height: 25px;
            line-height: 25px;
            border: none;
            background-color: #f7f7f7;
            border-radius: 10px;
          }
          .el-input__suffix {
            color: black;
          }
          .el-input__icon {
            line-height: 25px;
          }
        }
      } */
    }

    #album-intro{
        margin-top: 30px;
        #title{
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        #content{
            text-indent: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #676767;
        }

    }
  }
}
</style>