<template>
  <div id="music-list" v-loading="isLoading">
    <el-table
      :data="musicList"
      style="width: 100%"
      empty-text="当前没有音乐哦"
      size="mini"
      tooltip-effect="light"
      @row-dblclick="playMusic"
    >
      <el-table-column width="50">
        <template slot-scope="item">
          <div style="text-align: right; color: #909399; cursor: default">
            {{ item.$index | indexFormat }}
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
          <span style="cursor: default">{{ item.row.name }}</span>
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
      <el-table-column
        prop="ar[0].name"
        label="歌手"
        width="240"
        show-overflow-tooltip
      >
        <template slot-scope="item">
          <span
            id="artists"
            v-for="a in item.row.ar"
            :key="a.name"
            @click="toArtistDetail(a.id)"
            >{{ a.name }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="al.name"
        label="专辑名"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="item">
          <span id="albums" @click="toAlbum(item.row.al.id)">{{
            item.row.al.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="180">
        <template slot-scope="item">
          <div style="color: #909399; user-select: none">
            {{ item.row.dt | dtFormat }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      musicList: [],
      backup: [],
      isLoading: false,
      musicPlayList: [],
    };
  },
  props: {
    trackIds: {
      type: Array,
    },
    searchSong: {
      type: String,
    },
    songs: {
      type: Array,
    },
  },
  methods: {
    // 获取歌单所有歌曲
    async getAllMusic() {
      this.isLoading = true;
      if (!this.trackIds) {
        this.musicList = Object.freeze(this.songs);
        return (this.isLoading = false);
      }
      let idArr = [];
      this.trackIds.forEach((item, index) => {
        if (index < 800) {
          idArr.push(item.id);
        }
      });
      // console.log("idArr", idArr);
      if (idArr.length == 0) return;

      const res = await axios.get("/song/detail", {
        params: { ids: idArr.join(",") },
      });
      if (res.data.code !== 200) return;
      // console.log(res);
      this.musicList = Object.freeze(res.data.songs);
      this.backup = Object.freeze(res.data.songs);
      this.isLoading = false;
    },
    // 跳转到专辑
    toAlbum(id) {
      this.$router.push(`/album/${id}`);
    },
    // 跳转到歌手页面
    toArtistDetail(id) {
      this.$router.push(`/artistdetail/${id}`);
    },
    // 获取音乐url
    getMusicUrl(arr) {
      arr.forEach((item) => {
        let musicUrl = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;
        let artistName = item.ar[0].name;
        let artistId = item.ar[0].id;
        let musicId = item.id;
        let musicName = item.name;
        let musicPic = item.al.picUrl;
        this.musicPlayList.push({
          musicId,
          musicUrl,
          artistId,
          artistName,
          musicName,
          musicPic,
        });
      });
      this.$store.commit("setmusicPlayList", this.musicPlayList);
    },
    // 双击播放歌曲
    playMusic(row) {
      console.log(row);
      let musicUrl = `https://music.163.com/song/media/outer/url?id=${row.id}.mp3`;
      let artistName = row.ar[0].name;
      let artistId = row.ar[0].id;
      let musicId = row.id;
      let musicName = row.name;
      let musicPic = row.al.picUrl;
      this.$store.commit("setpresentMusic", {
        musicId,
        musicUrl,
        artistId,
        artistName,
        musicName,
        musicPic,
      });
      this.$store.dispatch('getLyric',musicId)
      this.$store.commit("setisPlay", true);
      this.getMusicUrl(this.musicList);
    },
  },
  watch: {
    // 搜索歌曲
    searchSong(newValue) {
      if (!newValue) {
        this.musicList = this.backup;
        return;
      }
      console.log("searchSong改变了", newValue);
      let arr = [];
      this.musicList.forEach((item, index) => {
        if (item.name.indexOf(newValue) !== -1) {
          arr.push(item);
        }
      });
      this.musicList = arr;
    },
  },
  filters: {
    indexFormat(val) {
      val = val + 1;
      if (val < 10) {
        return "0" + val;
      } else {
        return val;
      }
    },
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
    console.log(this.list);
    this.getAllMusic();
  },
};
</script>

<style lang="less" scoped>
#music-list {
  width: 100%;
  padding-bottom: 80px;
  ::v-deep .el-table {
    font-size: 12px;
    thead {
      th {
        font-weight: normal;
        border: none;
      }
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
}
</style>
