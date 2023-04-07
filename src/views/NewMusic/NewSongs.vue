<template>
  <div id="new-songs">
    <!-- 顶部 -->
    <div id="top-navi">
      <div id="area">
        <button
          v-for="(t, index) in typeList"
          :key="t.id"
          :class="{ active: currentAreaIndex === index }"
          @click="changeArea(index)"
        >
          {{ t.name }}
        </button>
      </div>

      <div id="play-and-collect">
        <button id="play-all">
          <i class="iconfont icon-bofang"></i>
          <span>播放全部</span>
        </button>
        <button id="collect-all">
          <i class="el-icon-folder-add"></i>
          <span>收藏全部</span>
        </button>
      </div>
    </div>

    <!-- 新歌展示区 -->
    <div id="new-songList">
      <ul>
        <li v-for="(m, index) in musicList" :key="index">
          <!-- 序列 -->
          <div id="list-order">
            {{ index | indexFormat }}
          </div>
          <!-- 图片 -->
          <img v-lazy="m.album.blurPicUrl + '?param=100y100'" />

          <!-- 描述 -->
          <div id="description">
            <span>{{ m.name }}</span>
            <span v-if="m.alias.length" style="color: #959595"
              >（{{ m.alias[0] }}）</span
            >
          </div>

          <!-- 歌手 -->
          <div id="artists">
            <span @click="toArtistDetail(m.artists[0].id)">
              {{ m.artists[0].name }}
            </span>
          </div>

          <!-- 补充信息 -->
          <div id="supplyment">
            <span @click="toAlbum(m.album.id)">
              {{ m.album.name }}
            </span>
          </div>

          <!-- 歌曲时长 -->
          <div id="time" style="color: #c3c3c4">
            {{ m.duration | timeFormat }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      typeList: [
        { id: 0, name: "全部" },
        { id: 7, name: "华语" },
        { id: 96, name: "欧美" },
        { id: 16, name: "韩国" },
        { id: 8, name: "日本" },
      ],
      currentAreaIndex: 0,
      musicList: [],
    };
  },
  methods: {
    changeArea(index) {
      if (this.currentAreaIndex == index) return;
      this.currentAreaIndex = index;
      this.getNewSongs(this.typeList[index].id);
    },
    async getNewSongs(type) {
      const res = await axios.get("/top/song", { params: { type } });
      if (res.data.code !== 200) return console.log("err", res.data);
      this.musicList = Object.freeze(res.data.data);
    },
    // 跳转歌手
    toArtistDetail(id){
      this.$router.push(`/artistdetail/${id}`)
    },
    // 跳转专辑
    toAlbum(id){
      this.$router.push(`/album/${id}`)
    }
  },
  filters: {
    timeFormat(value) {
      let data = new Date(value);
      let min = data.getMinutes();
      let sec = data.getSeconds();
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      return min + ":" + sec;
    },
    indexFormat(val) {
      let i = val < 9 ? "0" + (val * 1 + 1) : val * 1 + 1;
      return i;
    },
  },
  created() {
    this.getNewSongs(this.typeList[this.currentAreaIndex].id);
  },
};
</script>

<style lang="less" scoped>
#new-songs {
  #top-navi {
    display: flex;
    padding: 0 20px;
    line-height: 40px;
    height: 40px;
    justify-content: space-between;
    button {
      font-size: 16px;
      border: 0;
      outline: 0;
    }
    #area {
      button {
        background-color: rgba(0, 0, 0, 0);
        margin: 0 11px;
        color: #676767;
        cursor: pointer;
        &.active {
          font-weight: bold;
          color: #000 !important;
        }
        &:hover {
          color: #373737;
        }
      }
    }

    #play-and-collect {
      #play-all {
        background-color: #ec4141;
        color: white;
        height: 30px;
        border-radius: 15px;
        font-size: 12px;
        padding: 4px 14px;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          background-color: #d73535;
        }
      }
      #collect-all {
        background-color: rgba(0, 0, 0, 0);
        color: #343434;
        border: 1px solid #d8d8d8;
        height: 30px;
        border-radius: 15px;
        font-size: 12px;
        padding: 4px 14px;
        cursor: pointer;
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
  }

  #new-songList {
    margin-top: 10px;
    ul {
      li {
        display: flex;
        flex-wrap: nowrap;
        height: 90px;
        align-items: center;
        &:nth-child(odd) {
          background-color: #f9f9f9;
        }
        &:hover {
          background-color: #f0f1f2;
        }

        #list-order {
          color: #c3c3c4;
          margin-left: 35px;
          cursor: default;
        }

        img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
          margin-left: 20px;
          cursor: pointer;
        }
        #description {
          flex: 1;
          min-width: 100px;
          margin-left: 10px;
          cursor: default;
        }
        #artists {
          text-overflow: ellipsis;
          width: 200px;
          color: #616161;
          span {
            cursor: pointer;
            &:hover {
              color: #343434;
            }
          }
        }
        #supplyment {
          width: 200px;
          text-overflow: ellipsis;
          span {
            color: #616161;
            cursor: pointer;
            &:hover {
                color: #343434;
            }
          }
        }
        #time {
          width: 100px;
          text-align: center;
          cursor: default;
        }
      }
    }
  }
}
</style>