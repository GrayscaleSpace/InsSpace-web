// 发现音乐页面
<template>
  <div class="discovery router-view-center">
    <div class="discovery-content">
      <ImgBanner/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">


import ImgBanner from "../components/ImgBanner.vue";
export default {
  components: {ImgBanner  }
}
</script>

<style lang="scss" scoped>
.discovery {
  padding: 18px 32px;
}
</style>
