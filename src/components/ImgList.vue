<template>
  <div class="playlist-card">
    <SkeletonLoader :loading="loading" /> <!-- 使用 SkeletonLoader 组件 -->
    <div class="img-wrap">
      <img
          :data-src="datasrc"
          :src="this.$utils.genImgUrl(img, 300)"
          @load="onImageLoad"
          @error="onImageError"
       alt=""/>

<!--      <p v-if="imgFailed">加载失败，请重试</p>-->
      <div class="desc-wrap" v-if="name && imgLoaded">
        <span class="desc">{{ name }}</span>
      </div>
    </div>
  </div>

</template>


<script>
export default {
  props: ["id", "img", "name", "desc", "datasrc", "load"],
  name: "ImgList",
};
</script>
<script setup>

import { ref } from "vue";
import SkeletonLoader from "./SkeletonLoader.vue";

const imgLoaded = ref(false); // 控制图片是否加载完成
const imgFailed = ref(false); // 控制图片是否加载失败
const loading = ref(true); // 控制骨架屏的显示
const currentDate = new Date().toDateString();


// 图片加载完成时的回调
const onImageLoad = () => {
  imgLoaded.value = true;
  loading.value = false;
};

// 图片加载失败时的回调
const onImageError = () => {
  imgFailed.value = true;
  loading.value = false;
};
</script>

<style lang="scss" scoped>
/* 使用@import导入全局样式文件 */
@import '../style/variables.scss';

.playlist-card {
  position: relative;
  width: calc(20% - 8px);
  margin: 4px;
  margin-bottom: 32px;
  cursor: pointer;

  .img-wrap {
    position: relative;
    width: 100%;
    padding-top: 100%;
    margin-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;

    img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .desc-wrap {
      position: absolute;
      padding: 6px;
      left: 0;
      right: 0;
      top: 0;
      background-color: rgba(254, 61, 52, 0.4);
      transform: translateY(-100%);
      transition: all 0.3s;

      .desc {
        color: $white;
        font-size: $font-size-sm;
      }
    }

    .play-icon {
      opacity: 0;
      position: absolute;
      right: 4px;
      bottom: 4px;
      font-size: 24px;
      transition: all 0.3s;
      color: $white;
    }

    &:hover {
      .desc-wrap {
        transform: translateY(0);
      }

      .play-icon {
        opacity: 1;
      }
    }
  }

  .name {
    font-size: $font-size-sm;
  }
}
/* 在屏幕宽度小于768px时应用的样式 */
@media (max-width: 767px) {
  .playlist-card {
    position: relative;
    width: calc(100% - 8px);
    margin: 4px;
    margin-bottom: 0px;
    cursor: pointer;
  }
  /* 修改全局字体大小 */
  body {
    font-size: 14px;
  }

  /* 调整导航栏样式 */
  .header {
    background-color: #333;
    padding: 10px;
    text-align: center;
  }

  /* 修改全局链接颜色 */
  a {
    color: #ff6600;
  }

  /* 调整 .playlist-card 样式 */
  .playlist-card {
    width: 100%; /* 宽度占满屏幕 */
    margin: 0; /* 取消边距 */
    padding: 16px; /* 添加内边距 */
    background-color: #fff; /* 背景颜色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  }
}
</style>
