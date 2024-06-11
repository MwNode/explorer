<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import {
  useDashboard,
  LoadingStatus,
  type ChainConfig,
} from '@/stores/useDashboard';
import ChainSummary from '@/components/ChainSummary.vue';
import AdBanner from '@/components/ad/AdBanner.vue';

import { computed, onMounted, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();

const keywords = ref('');
const chains = computed(() => {
  if (keywords.value) {
    const lowercaseKeywords = keywords.value.toLowerCase();

    return Object.values(dashboard.chains).filter(
      (x: ChainConfig) => x.chainName.toLowerCase().indexOf(lowercaseKeywords) > -1 
      || x.prettyName.toLowerCase().indexOf(lowercaseKeywords) > -1
    );
  } else {
    return Object.values(dashboard.chains);
  }
});

const featured = computed(() => {
  const names = ["cosmos", "osmosis", "akash", "celestia", "evmos", "injective", "dydx", "noble"];
  return chains.value
    .filter(x => names.includes(x.chainName))
    .sort((a, b)=> (names.indexOf(a.chainName) - names.indexOf(b.chainName)))
})

const chainStore = useBlockchain()

</script>
<template>
  <div class="mw-dashboard">
    <div class="flex md:!flex-row flex-col items-center justify-center mb-6 mt-14 gap-2">
      <div class="hidden w-16 rounded-full">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 150.000000 132.000000"
          preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
          :fill="chainStore.current?.themeColor||'#666CFF'" class=" dark:invert" stroke="none">
            <path d="M500 1310 l-125 -5 -182 -315 c-100 -173 -182 -321 -182 -329 -1 -7
            81 -159 181 -337 l183 -324 372 0 371 0 186 325 c102 179 186 330 186 337 0 7
            -82 157 -182 335 l-183 323 -250 -2 c-137 -1 -306 -5 -375 -8z m588 -454 c61
            -106 112 -197 112 -201 0 -4 -50 -95 -111 -201 l-112 -194 -231 0 -231 0 -105
            181 c-58 100 -109 190 -114 200 -6 14 17 63 104 213 l112 196 232 0 231 0 113
            -194z"/>
            <path d="M591 1001 l-54 -6 -87 -150 -88 -150 176 -3 c97 -1 181 -1 187 2 9 3
            165 267 183 308 4 9 -233 7 -317 -1z"/>
            <path d="M872 824 l-90 -159 36 -66 c113 -201 147 -258 153 -251 8 8 179 302
            179 307 0 2 -37 68 -83 147 -46 78 -88 151 -94 162 -9 16 -24 -5 -101 -140z"/>
            <path d="M360 625 c0 -7 148 -263 172 -297 l19 -28 186 0 c101 0 183 3 181 8
            -1 4 -43 78 -93 165 l-90 157 -187 0 c-104 0 -188 -2 -188 -5z"/>
          </g>
        </svg>
      </div>
      <h1 class="text-white text-3xl md:!text-56 font-bold relative">
        <!-- {{ $t('pages.title') }} -->
        MW NODE
        <span class="mr-5"></span>
        Blockchain Explorer
        <div class="ellipse-home absolute">
          <svg width="333" height="98" viewBox="0 0 333 98" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M330.98 29.3368C331.647 34.9754 328.056 41.0974 320.364 47.3803C312.715 53.6276 301.245 59.8328 286.761 65.6322C257.808 77.2254 217.028 87.1114 171.292 92.517C125.556 97.9226 83.5955 97.816 52.7369 93.2921C37.3002 91.0291 24.6998 87.6688 15.8054 83.3768C6.86026 79.0604 1.94144 73.9441 1.27499 68.3055C0.608553 62.6669 4.19911 56.545 11.8915 50.2621C19.5402 44.0148 31.01 37.8096 45.4938 32.0102C74.4475 20.417 115.227 10.5309 160.963 5.12532C206.699 -0.280292 248.66 -0.173629 279.518 4.35022C294.955 6.61324 307.555 9.97352 316.45 14.2655C325.395 18.582 330.314 23.6982 330.98 29.3368Z" stroke="url(#paint0_linear_28_92)" stroke-width="2"/>
            <defs>
            <linearGradient id="paint0_linear_28_92" x1="124.939" y1="-27.3679" x2="140.415" y2="70.131" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF0000"/>
            <stop offset="0.59" stop-color="#FFC700"/>
            <stop offset="0.99" stop-color="#FBB040" stop-opacity="0"/>
            </linearGradient>
            </defs>
          </svg>
        </div>
      </h1>
    </div>
    <div class="text-center text-base">
      <p class="mb-1">
        {{ $t('pages.slogan') }}
      </p>
    </div>
    <div
      v-if="dashboard.status !== LoadingStatus.Loaded"
      class="flex justify-center"
    >
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>

    <div v-if="featured.length>0" class="text-center text-base mt-6 text-primary">
      <h2 class="mb-6"> Featured Blockchains 🔥 </h2>
    </div>

    <div v-if="featured.length>0"
      class="grid grid-cols-1 gap-4 lg:gap-30 mt-6 md:!grid-cols-3 lg:!grid-cols-4"
    >
    <ChainSummary
        v-for="(chain, index) in featured"
        :key="index"
        :name="chain.chainName"
      />
    </div>

    <AdBanner id="home-banner-ad" unit="banner" width="970px" height="90px" />

    <div class="text-center text-base mt-6 text-primary">
      <h2 class="mb-6">{{ $t('pages.description') }}</h2>
    </div>

    <div class="flex items-center rounded-lg bg-white-5 border border-white-10 dark:border-gray-700 mt-10">
      <Icon icon="mdi:magnify" class="text-2xl text-gray-400 ml-3"/>
      <input :placeholder="$t('pages.search_placeholder')" class="px-4 h-10 bg-transparent flex-1 outline-none text-base" v-model="keywords" />
      <div class="px-4 text-base hidden md:!block">{{ chains.length }}/{{ dashboard.length }}</div>
    </div>

    <div
      class="grid grid-cols-1 gap-4 lg:gap-30 mt-6 md:!grid-cols-3 lg:!grid-cols-4"
    >
      <ChainSummary
        v-for="(chain, index) in chains"
        :key="index"
        :name="chain.chainName"
      />
    </div>
  </div>
</template>

<!-- <style scoped>
 .logo path{
  fill: #171d30;
}
</style>@/components/ad/ad -->

<style lang="scss" scoped>
.logo path{
  fill: #171d30;
}

h1 {
  font-family: 'Open Sans';
  font-size: 56px;

  @media (min-width: 768px) {
    font-size: 56px !important;
    line-height: 1.5 !important;
  }
}
</style>