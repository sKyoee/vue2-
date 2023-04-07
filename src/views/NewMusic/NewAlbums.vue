<template>
  <div id="latest-albums">
    <!-- 顶部 -->
    <div id="top-navi">
      <div id="area">
        <button
          v-for="(t, index) in typeList"
          :key="t.area"
          :class="{ active: currentAreaIndex === index }"
          @click="changeArea(index)"
        >
          {{ t.name }}
        </button>
      </div>
    </div>

    <!-- 本周新碟 -->
    <div id="weekend-albums">
      <div id="reminder">
        <div id="content">本周新碟</div>
    </div>
      <HomePageAlbums v-loading="isLoading" :list="weekendAlbumList" type="album"></HomePageAlbums>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HomePageAlbums from "../../components/HomePageAlbums/HomePageAlbums.vue";
export default {
  components: { HomePageAlbums },
  data() {
    return {
      typeList: [
        { area: "ALL", name: "全部" },
        { area: "ZH", name: "华语" },
        { area: "EA", name: "欧美" },
        { area: "KR", name: "韩国" },
        { area: "JP", name: "日本" },
      ],
      currentAreaIndex: 0,
      weekendAlbumList: [],
      isLoading: false,
    };
  },
  methods: {
    changeArea(index) {
      if (this.currentAreaIndex == index) return;
      this.currentAreaIndex = index;
      this.getWeekendAlbums(this.typeList[index].area);
    },
    async getWeekendAlbums(area) {
      this.isLoading = true;
      const res = await axios.get("/top/album", { params: { area } });
      if (res.data.code !== 200) return;
      if (area == "ALL") {
        this.weekendAlbumList = Object.freeze(res.data.weekData);
      } else {
        this.weekendAlbumList = Object.freeze(res.data.monthData);
      }
      this.isLoading = false;
    },
  },
  created() {
    this.getWeekendAlbums(this.typeList[this.currentAreaIndex].area)
  },
};
</script>

<style lang="less" scoped>
#latest-albums {
  #top-navi {
    padding-left: 40px;
    line-height: 40px;
    height: 40px;
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
  }
  #weekend-albums{
    display: flex;
    #reminder{
        #content{
            position: relative;
            left: -20px;
            width: 45px;
            font-size: 20px;
        }
    }
  }
}
</style>