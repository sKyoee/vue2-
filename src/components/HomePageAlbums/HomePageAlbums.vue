<template>
  <div id="img-list">
    <ul id="img-box">
      <li v-for="item in list" :key="item.id" id="img-item">
        <div id="img-wrapper" @click="toPlayList(item.id)">
          <img v-lazy="picUrl(item)" />
          <!-- 右上角播放量 -->
          <div id="view-counts" v-if="item.playcount||item.playCount">
            <i class="iconfont icon-24gl-play"></i>
            <span>{{ item.playcount? item.playcount:item.playCount | convert }}</span>
          </div>
          <!-- 右下角播放图标 -->
          <div id="play" v-if="item.playcount||item.playCount">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>

        <div id="img-name">
          <span>{{ item.name }}</span>
        </div>
        <div id="description" v-if="item.artists">
          <span>{{item.artists[0].name}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    picUrl(item) {
        return `${item.img1v1Url || item.picUrl || item.coverImgUrl}?param=300y300`
    },
    toPlayList(id){
      if(this.type == 'artist'){
        this.$router.push(`/artistdetail/${id}`)
      } else if(this.type == 'playlist'){
        this.$router.push(`/playlistdetail/${id}`)
      } else if(this.type == 'album'){
        this.$router.push(`/album/${id}`)
      }
    },
    
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    type:{
      type:String,
      default:'playlist'
    }
  },
  filters: {
    // 播放量过滤器
    convert(value) {
       if(value > 10000){
        let res = Math.floor(value/10000)
        res = res + '万'
        return res
       } else {
        return value
       }
    },
  },
};
</script>

<style lang="less" scoped>
#img-list {
  #img-box {
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
    #img-item {
      width: 18%;
      margin-bottom: 30px;
      margin-right: 2%;
      #img-wrapper {
        color: white;
        position: relative;
        &:hover #play {
          opacity: 1;
        }
        img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: 5px;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        #view-counts {
          position: absolute;
          right: 10px;
          top: 10px;
          text-shadow: 0px 0px 2px #0f0f0f,;
          cursor: pointer;
          i {
            font-size: 12px;
            margin-right: 3px;
          }
        }
        #play {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0;
          transition: all 500ms;
          cursor: pointer;
          i {
            color: red;
            transform: translateX(5%);
          }
        }
      }

      #img-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
      }
      #description{
        margin-top: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #9f9f9f;
      }
    }
  }
}
</style>