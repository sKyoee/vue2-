<template>
  <div id="rankinglist-wrapper">
    <div id="official-wrapper">
      <div id="title-official">官方榜</div>
      <OfficialList
        v-if="officialList[0]"
        :item="officialList[0]"
      ></OfficialList>
      <OfficialList
        v-if="officialList[1]"
        :item="officialList[1]"
      ></OfficialList>
      <OfficialList
        v-if="officialList[2]"
        :item="officialList[2]"
      ></OfficialList>
      <OfficialList
        v-if="officialList[3]"
        :item="officialList[3]"
      ></OfficialList>
    </div>
    <div id="golbal-wrapper">
      <div id="golbal-title">全球榜</div>
      <HomePageAlbumsVue :list="globalList" v-loading="isLoading"></HomePageAlbumsVue>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OfficialList from "../components/OfficialList/OfficialList.vue";
import HomePageAlbumsVue from '../components/HomePageAlbums/HomePageAlbums.vue';
export default {
  components: { OfficialList,HomePageAlbumsVue },
  data() {
    return {
      officialList: [],
      globalList: [],
      /* soaringList:{},
      newSong:{},
      original:{},
      hitSong:{} */
      isLoading:false
    };
  },
  methods: {
    async getRankingList() {
      this.isLoading = true
      const res = await axios.get("/toplist");
      if (res.data.code !== 200) return;
      this.officialList = res.data.list.slice(0, 4);
      this.globalList = res.data.list.slice(4);
      this.isLoading = false
    },
  },
  created() {
    this.getRankingList();
  },
};
</script>

<style lang="less" scoped>
#rankinglist-wrapper {
  width: 1200px;
  #official-wrapper {
    #title-official {
      font-size: 20px;
      font-weight: bold;
    }
  }
  #golbal-wrapper {
    padding-bottom: 80px;
    #golbal-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>