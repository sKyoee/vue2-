<template>
  <div id="official-ranking">
    <div id="official-display">
      <div id="img-display" @click="toPlayList(item.id)">
        <img :src="item.coverImgUrl  + '?param=300y300'" />
        <div id="play">
            <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <ul id="ranking-single">
        <li v-for="(t, index) in tracks" :key="index">
          <div id="rank-name">
            <span id="rank">{{ index * 1 + 1 }}</span>
            <span id="name">{{ t.name }}</span>
          </div>
          <div id="artists">
            <div id="artist" v-for="(a, index) in t.ar" :key="a.id">
              <span @click="toArtistDetail(a.id)">{{ a.name }}</span>
              <i v-if="index >= 0 && index < Object.keys(t.ar).length-1">/</i>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div id="checkall">
      <button>查看全部<i class="el-icon-arrow-right"></i></button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tracks: [],
    };
  },
  methods: {
    async getTracks() {
      const res = await axios.get("/playlist/detail", {
        params: { id: this.item.id },
      });
      console.log(res.data);
      this.tracks = Object.freeze(res.data.playlist.tracks.slice(0, 5));
    },
    // 跳转
    toPlayList(id){
      this.$router.push(`/playlistdetail/${id}`)
    },
    toArtistDetail(id){
      this.$router.push(`/artistdetail/${id}`)
    }
  },
  created() {
    this.getTracks();
  },
};
</script>

<style lang="less" scoped>
#official-ranking {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  #official-display {
    display: flex;
    #img-display {
      position: relative;
      width: 160px;
      height: 160px;
      cursor: pointer;
      &:hover #play{
        opacity: 1;
      }
      img {
        width: 160px;
        border-radius: 5px;
      }
      #play {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0;
          transform: translateX(-50%) translateY(-50%);
          transition: all 500ms;
          i {
            color: red;
            transform: translateX(5%);
          }
        }
    }
    #ranking-single {
      width: 100%;
      margin-left: 30px;
      font-size: 14px;
      & li:nth-child(odd) {
        background-color: #f9f9f9;
      }
      & li:nth-child(-n + 3) {
        #rank {
          color: #f00;
        }
      }
      li {
        display: flex;
        justify-content: space-between;
        height: 32px;
        line-height: 32px;
        cursor: default;
        &:hover{
          background-color: rgb(243, 243, 243);
        }

        #rank-name {
          #rank,
          #name {
            margin-left: 12px;
          }
        }
        #artists {
          display: flex;
          margin-right: 10px;
          color: #9b9b9b;
          #artist {
            span{
              cursor: pointer;
              &:hover{
                color: #525252;
              }
            }
            i{
              padding: 0 5px;
            }
          }
        }
      }
    }
  }
  #checkall{
    margin-left: 200px;
    button{
      color: #676767;
      font-size: 14px;
      outline: 0;
      border: 0;
      background-color: rgba(0, 0, 0, 0);
      margin-top: 10px;
      cursor: pointer;
      &:hover{
        color: #414141;
      }
    }
  }
}
</style>