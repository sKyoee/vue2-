<template>
  <div>
    <Header/>
    <SideBar/>
    <PlayMusicBar/>
  </div>
</template>

<script>
import Header from "../components/Header/Header.vue";
import PlayMusicBar from '../components/PlayMusicBar/PlayMusicBar.vue';
import SideBar from "../components/SideBar/SideBar.vue"
export default {
  components: { Header,SideBar,PlayMusicBar },
};
</script>

<style>

</style>