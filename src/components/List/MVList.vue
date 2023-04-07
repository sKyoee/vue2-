<template></template>

<script>
import { get } from "../../request/index";
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  methods: {
    async getArtistMv(id) {
        const res = await get('/artist/mv',{id})
        if(res.code !== 200) return
        console.log(res)
    },
  },
  created() {
    this.getArtistMv(this.id)
  },
};
</script>

<style>
</style>