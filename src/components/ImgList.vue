<template>
  <div class="playlist-card" >
    <div class="img-wrap">
      <img :src="this.$utils.genImgUrl(img, 300)" :data-src = "datasrc"/>
<!--      <img :src="base64Image" />-->
      <div class="desc-wrap" v-if="name">
        <span class="desc">{{ name }}</span>
      </div>
    </div>
<!--    <p class="name">{{ name }}</p>-->
  </div>
</template>

<script>
export default {
  props: ["id", "img", "name", "desc","datasrc"],
  name: "ImgList",
  data() {
    return {
      base64Image: "", // 添加base64Image属性
    };
  },
  mounted() {
    // 在组件挂载后，将图片转换为Base64
    // this.convertImageToBase64();
  },
  methods: {
    async convertImageToBase64() {
      // 假设this.img包含图片的URL，你需要将其替换为实际的图片URL
      const imageUrl = this.img;
      try {
        // 使用Fetch API加载图片并转换为Base64
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          // 将Base64数据赋值给base64Image
          this.base64Image = reader.result;
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("转换图片为Base64时出错：", error);
      }
    },
  },
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
</style>
