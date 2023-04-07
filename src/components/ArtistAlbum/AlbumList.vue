<template>
  <div id="artisalbum-wrapper">
    <div id="img-wrapper" @click="toAlbumDetail(id)">
      <img :src="picUrl + '?param=300y300'" />
      <div id="publish-time">
        {{publishTime}}
      </div>
    </div>
    <div id="song-list">
      <div id="title">
        <span @click="toAlbumDetail(id)" style="user-select: none">{{ albumName }}</span>
        <div id="play-collect">
          <i class="el-icon-video-play"></i>
          <i class="el-icon-folder-add"></i>
        </div>
      </div>
      <div id="songs">
        <el-table
          :data="songs"
          style="width: 100%"
          empty-text="当前没有音乐哦"
          size="mini"
          :show-header="false"
          tooltip-effect="light"
        >
          <el-table-column width="40">
            <template slot-scope="item">
              <div style="text-align: center; color: #909399; cursor: default">
                {{
                  item.$index < 9 ? "0" + (item.$index + 1) : item.$index + 1
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="30">
            <template>
              <div id="like-music" style="text-align: center">
                <i class="iconfont icon-aixin"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="音乐标题" show-overflow-tooltip>
            <template slot-scope="item">
              <span style="cursor: default; color: #343434">{{
                item.row.name
              }}</span>
              <span
                v-if="item.row.fee == 1"
                id="tag"
                style="color: #fe672e; border-color: #fe672e"
                >VIP</span
              >
              <span v-if="item.row.sq" id="tag">SQ</span>
              <span v-if="item.row.mv !== 0" id="mv"
                >MV<i class="el-icon-caret-right"></i
              ></span>
            </template>
          </el-table-column>

          <el-table-column label="时长">
            <template slot-scope="item">
              <div style="color: #909399; user-select: none">
                {{ item.row.dt | dtFormat }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div id="show-all" v-if="songList.length > 10" @click="toAlbumDetail(id)">
          <span>查看全部{{ songList.length }}首></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "../../request/index";
export default {
  data() {
    return {
      songList: [],
      albumInfo: {},
    };
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    albumName() {
      return this.albumInfo.name;
    },
    picUrl() {
      return this.albumInfo.picUrl;
    },
    publishTime() {
      let pub = this.albumInfo.publishTime;
      let date = new Date(pub);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDay();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return `${year}-${month}-${day}`
    },
    songs(){
      return this.songList.slice(0,10)
    },
  },
  methods: {
    // 获取专辑内容
    async getAlbum(id) {
      const res = await get("/album", { id });
      if (res.code !== 200) return;
      console.log(res);
      this.songList = Object.freeze(res.songs);
      this.albumInfo = Object.freeze(res.album);
    },
    toAlbumDetail(id){
      this.$router.push(`/album/${id}`)
    }
  },
  filters: {
    dtFormat(val) {
      let duration = new Date(val);
      let min = duration.getMinutes();
      let sec = duration.getSeconds();
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      return min + ":" + sec;
    },
  },
  created() {
    this.getAlbum(this.id);
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-table {
  .cell {
    padding: 0 5px;
  }
  tbody {
    tr {
      &:nth-child(odd) {
        background-color: #f9f9f9;
      }
      &:hover > td {
        background-color: #f0f1f2;
        transition: 0s;
      }
      td {
        border: none;
        #like-music {
          i {
            color: #909399;
            cursor: pointer;
            &:hover {
              color: #000;
            }
          }
        }
        .el-tooltip {
          #tag,
          #mv {
            display: inline-block;
            font-size: 12px;
            transform: scale(0.9);
            line-height: 1;
            color: #ec4141;
            border: 1px solid #ec4141;
            padding: 0 2px;
            border-radius: 2px;
            margin-left: 5px;
            cursor: default;
          }
          #mv {
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      #artists {
        cursor: pointer;
        &::after {
          display: inline;
          margin: 3px;
          content: "/";
        }
        &:last-child::after {
          content: "";
        }
        &:hover {
          color: #000;
        }
      }
      #albums {
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
    }
  }
}

#artisalbum-wrapper {
  display: flex;
  margin-top: 20px;
  width: 100%;
  margin-bottom: 50px;
  #img-wrapper {
    min-width: 0;
    width: 200px;
    cursor: pointer;
    img {
      height: auto;
      max-width: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
    #publish-time{
      margin-top: 5px;
      color: #676767;
    }
  }
  #song-list {
    margin-left: 60px;
    width: 100%;
    #title {
      font-size: 16px;
      font-weight: bold;
      display: flex;
      width: 100%;
      span {
        color: #373737;
        cursor: pointer;
        &:hover{
          color: #000;
        }
      }
      #play-collect {
        margin-left: 20px;
        font-size: 20px;
        color: #666;
        display: flex;
        i {
          cursor: pointer;
        }
        i:first-child {
          display: flex;
        }
        i:first-child::after {
          content: "";
          display: block;
          margin: auto 10px;
          width: 1px;
          height: 50%;
          background-color: #e6e6e6;
        }
      }
    }
    #songs {
      margin-top: 10px;
      width: 100%;
      #show-all {
        width: 100%;
        height: 30px;
        background-color: #f9f9f9;
        text-align: right;
        line-height: 30px;
        color: #9b9b9b;
        cursor: pointer;
        span {
          margin-right: 30px;
        }
        &:hover {
          color: #656565;
        }
      }
    }
  }
}
</style>