<template>
  <div id="artists-wrapper">
    <div id="search-criteria">
      <div id="language">
        <span>语种：</span>
        <el-radio-group v-model="queryInfo.area" :border="false">
          <el-radio-button
            v-for="a in artistsData.area"
            :key="a.id"
            :label="a.id"
            >{{ a.value }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div id="type">
        <span>分类：</span>
        <el-radio-group v-model="queryInfo.type" :border="false">
          <el-radio-button
            v-for="t in artistsData.type"
            :key="t.id"
            :label="t.id"
            >{{ t.value }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div id="initial">
        <span>筛选：</span>
        <el-radio-group v-model="queryInfo.initial" :border="false">
          <el-radio-button
            v-for="i in artistsData.initial"
            :key="i.id"
            :label="i.id"
            >{{ i.value }}</el-radio-button
          >
        </el-radio-group>
      </div>
    </div>
    <div id="artists-list">
      <HomePageAlbumsVue :list="artistsList" :isLoading="isLoading" type="artist"></HomePageAlbumsVue>
    </div>
  </div>
</template>

<script>
const artistsData = require("../assets/json/artistData.json");
import axios from "axios";
import HomePageAlbumsVue from '../components/HomePageAlbums/HomePageAlbums.vue';
export default {
  components:{HomePageAlbumsVue},
  data() {
    return {
      queryInfo: {
        limit: 30,
        offset: 0,
        type: -1,
        area: -1,
        initial: "-1",
      },
      artistsList: [],
      artistsData,
      /* artistsData: {
        type: [
          {
            id: -1,
            value: "全部",
          },
          {
            id: 1,
            value: "男歌手",
          },
          {
            id: 2,
            value: "女歌手",
          },
          {
            id: 3,
            value: "乐队组合",
          },
        ],
        area: [
          {
            id: -1,
            value: "全部",
          },
          {
            id: 7,
            value: "华语",
          },
          {
            id: 96,
            value: "欧美",
          },
          {
            id: 8,
            value: "日本",
          },
          {
            id: 16,
            value: "韩国",
          },
          {
            id: 0,
            value: "其他",
          },
        ],
        initial: [
          {
            id: -1,
            value: "热门",
          },
          {
            id: "a",
            value: "A",
          },
          {
            id: "b",
            value: "B",
          },
          {
            id: "c",
            value: "C",
          },
          {
            id: "d",
            value: "D",
          },
          {
            id: "e",
            value: "E",
          },
          {
            id: "f",
            value: "F",
          },
          {
            id: "g",
            value: "G",
          },
          {
            id: "h",
            value: "H",
          },
          {
            id: "i",
            value: "I",
          },
          {
            id: "j",
            value: "J",
          },
          {
            id: "k",
            value: "K",
          },
          {
            id: "l",
            value: "L",
          },
          {
            id: "m",
            value: "M",
          },
          {
            id: "n",
            value: "N",
          },
          {
            id: "o",
            value: "O",
          },
          {
            id: "p",
            value: "P",
          },
          {
            id: "q",
            value: "Q",
          },
          {
            id: "r",
            value: "R",
          },
          {
            id: "s",
            value: "S",
          },
          {
            id: "t",
            value: "T",
          },
          {
            id: "u",
            value: "U",
          },
          {
            id: "v",
            value: "V",
          },
          {
            id: "w",
            value: "W",
          },
          {
            id: "x",
            value: "X",
          },
          {
            id: "y",
            value: "Y",
          },
          {
            id: "z",
            value: "Z",
          },
          {
            id: 0,
            value: "#",
          },
        ],
      }, */
      isLoading:false
    };
  },
  watch:{
    queryInfo:{
      deep:true,
      handler(){
        this.getArtistList(this.queryInfo)
      }
    }
  },
  methods: {
    async getArtistList({ limit, offset, type, area, initial }) {
      this.isLoading = true
      const res = await axios.get("artist/list", {
        params: { limit, offset, type, area, initial },
      });
      if (res.data.code !== 200) return console.log("err", res.data);
      console.log(res.data);
      this.artistsList = Object.freeze(res.data.artists);
      this.isLoading = false
    },
  },
  created() {
    this.getArtistList(this.queryInfo);
  },
};
</script>

<style lang="less" scoped>
#artists-wrapper {
  width: 1200px;
  #search-criteria {
    font-size: 14px;
    #language {
      display: flex;
      margin-top: 10px;
      span {
        width: 60px;
        height: 30px;
        line-height: 30px;
      }
    }
    #type{
      display: flex;
      margin-top: 10px;
      span {
        width: 60px;
        height: 30px;
        line-height: 30px;
      }
    }
    #initial{
      display: flex;
      margin-top: 10px;
      span {
        width: 60px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  #artists-list{
    padding-bottom: 80px;
  }
}


::v-deep .el-radio-group{
    width: 80%;
}
::v-deep .el-radio-button{
    line-height: 30px ;
}
::v-deep .el-radio-button__inner{
    border: 0px !important;
    outline: 0;
    width: 60px;
    height: 30px;
    line-height: 30px ;
    margin-right: 30px ;
    padding: 0 ;
    border-radius: 15px !important;
}
::v-deep .el-radio-button__inner:hover{
    color: #ec4141 ;
}
::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    color: #ec4141 ;
    background-color: #fdf5f5 ;
    box-shadow: none ;
}
</style>