<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';

// Components
import newFooter from './NavFooter.vue';
import NavbarThemeSwitcher from './NavbarThemeSwitcher.vue';
import NavbarSearch from './NavbarSearch.vue';
import ChainProfile from './ChainProfile.vue';
import Logo from './Logo.vue';
import BackgroundEffect from './BackgroundEffect.vue';
import chainhome from './testChainIndex.vue';

import { useDashboard } from '../../stores/useDashboard';
import { useBaseStore, useBlockchain } from '../../stores';

import NavBarI18n from './NavBarI18n.vue';
import NavBarWallet from './NavBarWallet.vue';
import type { NavGroup, NavLink, NavSectionTitle, VerticalNavItems } from '../types';
import dayjs from 'dayjs';

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();
console.log(blockchain);
blockchain.randomSetupEndpoint();
const baseStore = useBaseStore();

const current = ref(''); // the current chain
const temp = ref('')
blockchain.$subscribe((m, s) => {
  if(current.value === s.chainName && temp.value != s.endpoint.address) {
    temp.value = s.endpoint.address
    blockchain.initial();
  }
  if (current.value != s.chainName) {
    current.value = s.chainName;
    blockchain.randomSetupEndpoint();
  }
});

const sidebarShow = ref(false);
const sidebarOpen = ref(true);

const changeOpen = (index: Number) => {
  if (index === 0) {
    sidebarOpen.value = !sidebarOpen.value;
  }
};
const showDiscord = window.location.host.search('ping.pub') > -1;

function isNavGroup(nav: VerticalNavItems | any): nav is NavGroup {
   return (<NavGroup>nav).children !== undefined;
}
function isNavLink(nav: VerticalNavItems | any): nav is NavLink {
   return (<NavLink>nav).to !== undefined;
}
function isNavTitle(nav: VerticalNavItems | any): nav is NavSectionTitle {
   return (<NavSectionTitle>nav).heading !== undefined;
}
function selected(route: any, nav: NavLink) {
  const b = route.path === nav.to?.path || route.path.startsWith(nav.to?.path) && nav.title.indexOf('dashboard') === -1
  return b
}
const blocktime = computed(() => {
  return dayjs(baseStore.latest?.block?.header?.time)
});

const behind = computed(() => {
  const current = dayjs().subtract(10, 'minute')
  return blocktime.value.isBefore(current)
});

function setHeightBackground() {
  const bodyH = document.getElementById('app')?.offsetHeight;
  let height = '100%';
  if (bodyH && bodyH > 0) {
    height = bodyH?.toString() + 'px';
  }

  const elBackground = document.getElementById('mw-background-effect');
  if (elBackground) {
    elBackground.style.height = height;
  }
  // console.log('bodyH: ' + height);
  return true;
}

onMounted(() => {
  setHeightBackground();
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("load", handleLoad);
  window.addEventListener("unload", handleUnload);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("load", handleLoad);
  window.removeEventListener("unload", handleUnload);
  window.removeEventListener("resize", handleResize);
})

const handleScroll = () => {
  // console.log('scroll');
  setHeightBackground();
}

const handleLoad = () => {
  console.log('load');
  setHeightBackground();
}

const handleUnload = () => {
  console.log('unload');
  setHeightBackground();
}

const handleResize = () => {
  console.log('resize');
  setHeightBackground();
}


dayjs()


</script>

<template>
  <div class="" @scroll="setHeightBackground">
    <!-- background -->
    <BackgroundEffect class="bg-mw-base h-dvh" />
    <!-- sidebar -->
    <div
      class="sidebar w-64 fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-mw-base md:bg-white-5"
      :class="{ block: sidebarShow, 'hidden xl:!block': !sidebarShow }"
    >
      <div class="flex justify-between mt-1 pl-4 py-4 mb-1">
        <RouterLink to="/" class="flex items-center">
          <Logo />
          <!-- <img class="w-10 h-10" src="../../assets/logo.svg" />
          <h1 class="flex-1 ml-3 text-2xl font-semibold text-main">
            Ping.pub
          </h1> -->
        </RouterLink>
        <div
          class="pr-4 cursor-pointer xl:!hidden"
          @click="sidebarShow = false"
        >
          <Icon icon="mdi-close" class="text-2xl" />
        </div>
      </div>
      <div
        v-for="(item, index) of blockchain.computedChainMenu"
        :key="index"
        class="px-2"
      >
        <div
          v-if="isNavGroup(item)"
          :tabindex="index"
          class="collapse"
          :class="{
            'collapse-arrow':index > 0 && item?.children?.length > 0,
            'collapse-open': index === 0 && sidebarOpen,
            'collapse-close': index === 0 && !sidebarOpen,
          }"
        >
          <input
            v-if="index > 0"
            type="checkbox"
            class="cursor-pointer !h-10 block"
            @click="changeOpen(index)"
          />
          <div
            class="collapse-title !py-0 px-4 flex items-center"
          >
            <Icon
              v-if="item?.icon?.icon"
              :icon="item?.icon?.icon"
              class="text-xl mr-2"
              :class="{
                'text-yellow-500': item?.title === 'Favorite',
                'text-blue-500': item?.title !== 'Favorite',
              }"
            />
            <img
              v-if="item?.icon?.image"
              :src="item?.icon?.image"
              class="w-6 h-6 rounded-full mr-3"
            />
            <div
              class="text-base capitalize flex-1 text-gray-200 whitespace-nowrap"
            >
              {{ item?.title }}
            </div>
            <div
              v-if="item?.badgeContent"
              class="mr-6 badge badge-sm text-main border-none"
              :class="item?.badgeClass"
            >
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div v-for="(el, key) of item?.children" class="menu btn-mw-gradient-hover--outside w-full rounded-full my-1 border-transparent !p-0">
              <!-- class="hover:bg-gray-100 dark:hover:bg-[#373f59] cursor-pointer px-3 py-2 flex items-center" -->
              <RouterLink
                v-if="isNavLink(el) && !['module.widget', 'module.state-sync', 'module.consensus', 'module.ibc'].includes(el.title)"
                @click="sidebarShow = false"
                class="btn-mw-gradient-hover--inside rounded-full cursor-pointer px-3 py-2 flex items-center"
                :class="{
                  'active': selected($route, el),
                }"
                :to="el.to"
              >
                <Icon
                  v-if="!el?.icon?.image"
                  icon="mdi:chevron-right"
                  class="mr-2 ml-3"
                  :class="{
                    'text-main':
                      $route.path === el?.to?.path &&
                      item?.title !== 'Favorite',
                  }"
                />
                <img
                  v-if="el?.icon?.image"
                  :src="el?.icon?.image"
                  class="w-6 h-6 rounded-full mr-3 ml-4 " :class="{
                  'border border-gray-300 bg-white': selected($route, el),
                }"
                />
                <div
                  class="text-gray-200 text-base capitalize"
                  :class="{
                    '!text-main': selected($route, el),
                  }"
                >
                  {{ item?.title === 'Favorite' ? el?.title : $t(el?.title) }}
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink
          v-if="isNavLink(item)"
          :to="item?.to"
          @click="sidebarShow = false"
          class="cursor-pointer rounded-lg px-4 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon
            v-if="item?.icon?.icon"
            :icon="item?.icon?.icon"
            class="text-xl mr-2"
            :class="{
              'text-yellow-500': item?.title === 'Favorite',
              'text-blue-500': item?.title !== 'Favorite',
            }"
          />
          <img
            v-if="item?.icon?.image"
            :src="item?.icon?.image"
            class="w-6 h-6 rounded-full mr-3 border border-blue-100"
          />
          <div
            class="text-base capitalize flex-1 text-gray-200 whitespace-nowrap"
          >
            {{ item?.title }}
          </div>
          <div
            v-if="item?.badgeContent"
            class="badge badge-sm text-main border-none" 
            :class="item?.badgeClass"
          >
            {{ item?.badgeContent }}
          </div>
        </RouterLink>
        <div
          v-if="isNavTitle(item)"
          class="px-4 text-sm text-gray-400 md:text-gray-200 pb-2 uppercase"
        >
          {{ item?.heading }}
        </div>
      </div>
      <div class="px-2 hidden">
          <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
            Tools
          </div>
          <RouterLink to="/wallet/suggest"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
          >
            <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
            <div
              class="text-base capitalize flex-1 text-main"
            >
              Wallet Helper
            </div>
          </RouterLink>
          <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
          {{ $t('module.sponsors') }}
        </div>
        <a
          href="https://osmosis.zone"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <img
            src="https://ping.pub/logos/osmosis.jpg"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-sm capitalize flex-1 text-main"
          >
            Osmosis
          </div>
        </a>
        <a
          href="https://celestia.org"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <img
            src="https://ping.pub/logos/celestia.png"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-sm capitalize flex-1 text-main"
          >
            Celestia
          </div>
        </a>
        <a
          href="https://becole.com"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <img
            src="https://becole.com/static/logo/logo_becole.png"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-sm capitalize flex-1 text-main"
          >
            Becole
          </div>
        </a>
        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">{{ $t('module.links') }}</div>
        <a
          href="https://twitter.com/ping_pub"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:twitter" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-main"
          >
            Twitter
          </div>
        </a>
        <a
          v-if="showDiscord"
          href="https://discord.com/invite/CmjYVSr6GW"
          target="_blank"
          class="py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:discord" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-main"
          >
            Discord
          </div>
        </a>
        <a
          href="https://github.com/ping-pub/explorer/discussions"
          target="_blank"
          class="py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-main"
          >
            FAQ
          </div>
        </a>
      </div>
    </div>
    <div class="xl:!ml-64">
      <!-- header -->
      <div
        class="header flex items-center py-3 mb-4 px-4 sticky top-0 z-10 bg-mw-base md:bg-mw-base-80 shadow"
      >
        <div
          class="text-2xl pr-3 cursor-pointer xl:!hidden"
          @click="sidebarShow = true"
        >
          <Icon icon="mdi-menu" />
        </div>

        <!-- <ChainProfile /> -->

        <div class="flex-1 w-0"></div>

        <!-- <NavSearchBar />-->
        <!-- <NavBarI18n class="hidden md:!inline-block" /> -->
        <!-- <NavbarThemeSwitcher class="!inline-block" /> -->
        <NavbarSearch class="!inline-block" />
        <NavBarWallet />
      </div>

      <!-- 👉 Pages -->
      <div class="px-3 py-4 body-container" style="min-height: calc(100vh - 180px);">
        <div v-if="behind" class="alert alert-error mb-4">
            <div class="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-current flex-shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ $t('pages.out_of_sync') }} {{ blocktime.format() }} ({{ blocktime.fromNow() }})</span>
            </div>
        </div>
        <RouterView v-slot="{ Component }">
          <Transition mode="out-in">
            <Component :is="Component" />
          </Transition>
        </RouterView>
        <!-- <chainhome /> -->
      </div>

      <newFooter class="px-3" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
