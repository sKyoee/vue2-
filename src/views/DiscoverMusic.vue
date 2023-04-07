<template>
  <div id="show">
    <div id="top-navi">
      <ul id="navi-wrapper">
        <li>
          <router-link active-class="active" to="/discovermusic/personalrecom"
            >个性推荐</router-link
          >
        </li>
        <li>
          <router-link active-class="active" to="/discovermusic/playlist"
            >歌单</router-link
          >
        </li>
        <li>
          <router-link active-class="active" to="/discovermusic/ranking"
            >排行榜</router-link
          >
        </li>
        <li>
          <router-link active-class="active" to="/discovermusic/singer"
            >歌手</router-link
          >
        </li>
        <li>
          <router-link active-class="active" to="/discovermusic/latestmusic"
            >最新音乐</router-link
          >
        </li>
      </ul>
    </div>
    <div id="route-area">
      <!-- 跳转到页面顶部 -->
      <template>
        <el-backtop
          target="#route-area"
        ><i class="el-icon-caret-top" style="color:red;"></i></el-backtop>
      </template>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
#show {
  #top-navi {
    display: flex;
    height: 60px;
    width: 100%;
    position: fixed;
    left: 201px;
    top: 60px;
    z-index: 99;
    background-color: #fff;
    #navi-wrapper {
      display: flex;
      margin-left: 50px;
      align-items: center;
      justify-content: flex-start;
      li {
        color: rgb(0, 0, 0);
        line-height: 60px;
        font-size: 14px;
        margin: 10px;
        a.active {
          font-size: 18px;
          font-weight: bold;
          color: #000000;
          border-bottom: 4px red solid;
          border-radius: 2px;
        }
      }
    }
  }
  #route-area {
    position: absolute;
    top: 60px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: overlay;
  }
}
</style>