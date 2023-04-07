<template>
  <div id="main">
    <div id="side-bar">
      <div id="side-wrapper">
        <ul id="discover-music">
          <li id="discover-music-first">
            <router-link active-class="active" to="/discovermusic"
              >发现音乐</router-link
            >
          </li>
          <li>
            <router-link active-class="active" to="/vedio">视频</router-link>
          </li>
          <li>
            <router-link active-class="active" to="personalfm"
              >私人FM</router-link
            >
          </li>
        </ul>
        <ul id="my-music">
          <li id="my-music-first"><a href="javascript:;">我的音乐</a></li>
          <li>
            <router-link active-class="active" to="/recently"
              ><i class="el-icon-download"></i>最近播放</router-link
            >
          </li>
          <li>
            <router-link active-class="active" to="/mycollected"
              >我的收藏</router-link
            >
          </li>
        </ul>
        <ul id="created-playList">
          <li id="created-playList-first">
            <router-link active-class="active" to="/createdplaylist"
              >创建的歌单</router-link
            >
          </li>
        </ul>
        <ul id="collected-playList">
          <li id="collected-playList-first">
            <router-link active-class="active" to="/collectedplaylist">
              收藏的歌单
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div id="main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import DiscoverMusicVue from "../../views/DiscoverMusic.vue";
export default {
  components: {
    DiscoverMusicVue,
  },
};
</script>

<style lang="less" scoped>
.active {
  background-color: #f5f5f6;
  color: #000;
  font-weight: bold;
}
li {
  margin-bottom: 3px;
}
#main {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 80px;
  height: auto;
  width: auto;
  #side-bar {
    position: absolute;
    left: 0;
    width: 200px;
    border-right: 1px #e0e0e0 solid;
    height: 100%;

    #side-wrapper {
      // border: 1px black solid;
      width: 185px;
      margin-top: 10px;
      margin-left: 12px;

      a {
        color: #4e4e4e;
        font-size: 14px;
        display: block;
        border-radius: 4px;
        padding-left: 8px;
        line-height: 36px;
      }

      a:hover {
        background-color: #f5f5f6;
        color: #000;
      }
    }

    #my-music {
      .el-icon-download {
        margin-right: 4px;
      }

      #my-music-first {
        margin: -3px auto;
        a {
          font-size: 13px;
          margin: 0;
          padding-left: 8px;
          color: #9f9f9f;
          pointer-events: none;
        }

        a:hover {
          cursor: default;
          background-color: #fff;
          color: #9f9f9f;
        }
      }
    }

    #created-playList {
      #created-playList-first {
        margin: -3px auto;
        a {
          font-size: 13px;
          margin: 0;
          padding-left: 8px;
          color: #9f9f9f;
          pointer-events: none;
        }

        a:hover {
          cursor: default;
          background-color: #fff;
          color: #9f9f9f;
        }
      }
    }

    #collected-playList {
      #collected-playList-first {
        margin: -3px auto;
        a {
          font-size: 13px;
          margin: 0;
          padding-left: 8px;
          color: #9f9f9f;
          pointer-events: none;
        }

        a:hover {
          cursor: default;
          background-color: #fff;
          color: #9f9f9f;
        }
      }
    }
  }
  #main-right {
    position: absolute;
    left: 200px;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: auto;
  }
}
</style>
