<template>
  <div class="layout">
    <div class="layout-body">
      <div
        class="layout-menu"
      >
      </div>
      <div
        class="content"
        id="page-content"
      >
<!--        <Banner/>-->
        <ListImg/>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import Banner from "./Banner.vue";
import ListImg from "./ListImg.vue";
export default {
  data() {
    return {}
  },
  components: {
    ListImg,
    Banner
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
/* 使用@import导入全局样式文件 */
@import '../style/variables.scss';
.layout {
  height: 100%;

  .layout-body {
    display: flex;
    height: calc(100% - #{$header-height});

    .layout-menu {
      // 这个100%已经减去了头部height
      height: calc(100% - #{$mini-player-height});
    }

    .content {
      flex: 1;
      overflow-y: auto;
      min-width: $layout-content-min-width;
      margin-bottom: $mini-player-height;

      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>
