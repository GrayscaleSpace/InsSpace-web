<template>
  <el-space direction="vertical" alignment="flex-start" :style="topStyle">
    <!-- 使用v-if来根据loading控制骨架屏的显示 -->
    <!-- 使用计算属性来设置样式 -->
    <el-skeleton :style="skeletonStyle"
                 :loading="loading"
    animated
    :throttle="500"
    >
    <!-- 骨架屏的内容 -->
    <template #template>
      <el-skeleton-item variant="image" :style="imageStyle" />
      <div :style="contentStyle">
        <el-skeleton-item variant="h3" :style="titleStyle" />
        <div
            :style="dividerStyle"
        ></div>
      </div>
    </template>
    </el-skeleton>
  </el-space>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },
  computed: {
    topStyle(){
      // 根据屏幕宽度小于768px时的样式设置骨架的样式
      return window.innerWidth < 768 ? {
        width: '100%',
        // 其他样式属性
      } : {
        width: '240px',
        // 其他样式属性
      };
    },
    skeletonStyle() {
      // 根据屏幕宽度小于768px时的样式设置骨架的样式
      return window.innerWidth < 768 ? {
        width: '100%',
        // 其他样式属性
      } : {
        width: '240px',
        // 其他样式属性
      };
    },
    imageStyle() {
      // 根据屏幕宽度小于768px时的样式设置骨架图片的样式
      return window.innerWidth < 768 ? {
        width: '100%',
        height: '200%',
        // 其他样式属性
      } : {
        width: '240px',
        height: '240px',
        // 其他样式属性
      };
    },
    contentStyle() {
      // 根据屏幕宽度小于768px时的样式设置骨架内容区域的样式
      return window.innerWidth < 768 ? {
        padding: '14px',
        // 其他样式属性
      } : {
        padding: '14px',
        // 其他样式属性
      };
    },
    titleStyle() {
      // 根据屏幕宽度小于768px时的样式设置标题的样式
      return window.innerWidth < 768 ? {
        width: '100%',
        // 其他样式属性
      } : {
        width: '50%',
        // 其他样式属性
      };
    },
    dividerStyle() {
      // 根据屏幕宽度小于768px时的样式设置分隔线的样式
      return window.innerWidth < 768 ? {
        display: 'none', // 在小屏幕上隐藏分隔线
        // 其他样式属性
      } : {
        display: 'block', // 在大屏幕上显示分隔线
        // 其他样式属性
      };
    },
  },
};
</script>
