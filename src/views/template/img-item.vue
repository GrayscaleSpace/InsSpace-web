<template>
  <div class="video anim" @click="detail" style="--delay: .4s">
    <div class="video-time">{{data.size}}</div>
    <div class="video-wrapper">
<!--      <video muted="">-->
<!--        <source-->
<!--            src="https://player.vimeo.com/external/436572488.sd.mp4?s=eae5fb490e214deb9ff532dd98d101efe94e7a8b&profile_id=139&oauth2_token_id=57447761"-->
<!--            type="video/mp4">-->
<!--      </video>-->
      <img v-if="loadError" :src="'/error.png'"/>
      <v-lazy-image muted=""
          v-else
          :src="data.url"
          class="bzImg"
          @load="hanldeLoad"
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
    <div class="video-by">{{data.only}}</div>
    <div class="video-name">{{data.name}}</div>
    <div class="video-view">
<!--      <span class="seperate video-seperate"></span>-->
      {{data.createTime}}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ImageInter} from '@/typings/interface';
import {computed, Ref, ref, watch} from 'vue';
import {useCopyText, useCtxInstance} from '@/hooks/global';
import VLazyImage from 'v-lazy-image';
import {useRouter} from "vue-router";

const loaded = ref(false)
const router = useRouter()
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
function detail(){
  router.push({
    path: '/template/img-show',
    query: {
      id: props.data.only // 替换为你的实际数据
    }
  });
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