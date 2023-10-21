<template>
  <div id="latestMusic-wrapper">
    <div id="songs-or-albums">
      <div id="btn-wrapper">
        <button
          :class="{ active: index === 'NewSongs' }"
          @click="clickBtn('NewSongs')"
        >
          新歌速递
        </button>
        <button
          :class="{ active: index === 'NewAlbums' }"
          @click="clickBtn('NewAlbums')"
        >
          新碟上架
        </button>
      </div>
    </div>
    <div id="new-music-view">
      <component :is="index"></component>
    </div>
  </div>
</template>

<script>
import NewAlbums from "./NewMusic/NewAlbums.vue";
import NewSongs from "./NewMusic/NewSongs.vue";
export default {
  components: { NewAlbums, NewSongs },
  data() {
    return {
      index: "NewSongs",
    };
  },
  methods: {
    clickBtn(val) {
      this.index = val;
    },
  },
};
</script>

<style lang="less" scoped>
#latestMusic-wrapper {
  width: 1200px;
  #songs-or-albums {
    height: 32px;
    display: flex;
    justify-content: center;
    font-size: 100%;
    #btn-wrapper {
      border: 1px solid #bbb;
      border-radius: 15px;
      button {
        width: 120px;
        height: 30px;
        outline: 0;
        border: 0;
        border-radius: 15px;
        background-color: rgba(0, 0, 0, 0);
        &.active {
          background-color: #bbb !important;
          color: white;
        }
        &:hover {
          background-color: #f4f4f4;
        }
      }
    }
  }

  #new-music-view {
    margin-top: 10px;
    padding-bottom: 100px;
  }
}
</style>