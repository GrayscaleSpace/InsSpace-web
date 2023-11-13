<template>
  <div class="video anim" @click="detail" style="--delay: .4s">
<!--    <div class="video-time">{{ data.name }}</div>-->
    <div class="video-wrapper">
<!--      <video muted="" >-->
<!--                <source-->
<!--                    src=""-->
<!--                type="video/mp4">-->
<!--      </video>-->

      <v-lazy-image muted=""
                    :src="data.remoteUrl"
                    class="bzImg"
                    @load="hanldeLoad"
                    @error="handleRenderError" :src-placeholder="placeholder"
      ></v-lazy-image>

      <!--      <div class="author-img__wrapper video-author">-->
      <!--        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"-->
      <!--             stroke-linejoin="round" class="feather feather-check">-->
      <!--          <path d="M20 6L9 17l-5-5"/>-->
      <!--        </svg>-->
      <!--        <img class="author-img"-->
      <!--             src="https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"/>-->
      <!--      </div>-->
    </div>
<!--    <div class="video-by">{{ data.only }}</div>-->
<!--    <div class="video-name">{{ data.name }}</div>-->
<!--    <div class="video-view ">666K-->
<!--      <span class="seperate video-seperate"></span>浏览-->
<!--    </div>-->

  </div>
</template>

<script lang="ts" setup>
import {ImageInter} from '@/typings/interface';
import {ref} from 'vue';
import VLazyImage from 'v-lazy-image';
import {useRouter} from "vue-router";

const loaded = ref(false)
const router = useRouter()
const placeholder = new URL('./loading.gif', import.meta.url).href

interface Props {
  data: ImageInter
  fit?: string
  images?: Array<string>
  remove?: boolean
}

interface BtnProps {
  icon?: string
  type?: "success" | "warning" | "info" | "text" | "primary" | "danger"
  title?: string
  action?: string
  disabled?: boolean
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  fit: 'scale-down',
  remove: false,
  data: () => ({
    img_name: '',
    img_preview_url: '',
    checked: false
  } as ImageInter)
})

function hanldeLoad() {
  loaded.value = true
}

function detail() {
  router.push({
    path: '/template/img-show',
    query: {
      id: props.data.only // 替换为你的实际数据
    }
  });
}

const loadError = ref(false)

function handleRenderError() {
  loadError.value = true
}
</script>

<style scoped>

.bzImg {
  max-width: 100%;
  width: 100%;
  border-radius: 20px 20px 0 0;
  display: block;
  cursor: pointer;
  transition: 0.4s;
}
</style>