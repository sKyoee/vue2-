<template>
  <div id="mv-wrapper">
    <div class="flex" v-for="(m, index) in mvList" :key="index">
      <div id="img-wrapper">
        <div id="play-count">
          <i class="iconfont icon-24gl-play"></i>
          <span> {{ m.playCount | playCountFormat }}</span>
        </div>
        <img :src="m.imgurl + '?param=250y140'" />
        <div id="duration">{{ m.duration | dtFormat }}</div>
      </div>
      <span id="name">{{ m.name }}</span>
    </div>
  </div>
</template>

<script>
import { get } from "../../request/index";
export default {
  data() {
    return {
      mvList: [],
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    async getArtistMv(id) {
      const res = await get("/artist/mv", { id });
      if (res.code !== 200) return;
      console.log(res);
      this.mvList = Object.freeze(res.mvs);
    },
  },
  filters: {
    playCountFormat(val) {
      if (val > 100000) {
        return Math.round(val / 10000) + "万";
      } else {
        return val;
      }
    },
    dtFormat(val) {
      let date = new Date(val);
      let min = date.getMinutes()
      let sec = date.getSeconds()
      min = min < 10 ? '0' + min :min
      sec = sec < 10 ? '0' + sec :sec
      if(val>86400000){
        let hour = date.getHours()
        return `${hour}:${min}:${sec}`
      } else {
        return `${min}:${sec}`
      }
      
    },
  },
  created() {
    this.getArtistMv(this.id);
  },
};
</script>

<style lang="less" scoped>
#mv-wrapper {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  .flex {
    width: 250px;
    margin-right: 20px;
    margin-bottom: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    #img-wrapper {
      position: relative;
      width: 250px;
      height: 140px;
      margin-bottom: 8px;
      overflow: hidden;
      cursor: pointer;
      #play-count {
        position: absolute;
        color: rgb(255, 255, 255);
        text-shadow: 0 0 2px #000;
        top: 2px;
        right: 5px;
        i {
          font-size: 12px;
        }
      }
      img {
        height: 100%;
        width: 100%;
        border-radius: 5px;
        object-fit: cover;
      }
      #duration{
        position: absolute;
        right: 6px;
        bottom: 3px;
        color: white;
        text-shadow: 0 0 2px #000;
      }
    }
    #name {
      font-size: 14px;
      color: #373737;
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
  }
}
</style>