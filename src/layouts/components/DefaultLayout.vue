<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';

// Components
import newFooter from './NavFooter.vue';
import NavbarThemeSwitcher from './NavbarThemeSwitcher.vue';
import NavbarSearch from './NavbarSearch.vue';
import ChainProfile from './ChainProfile.vue';

import { useDashboard } from '../../stores/useDashboard';
import { useBaseStore, useBlockchain } from '../../stores';

import NavBarI18n from './NavBarI18n.vue';
import NavBarWallet from './NavBarWallet.vue';
import type { NavGroup, NavLink, NavSectionTitle, VerticalNavItems } from '../types';
import dayjs from 'dayjs';

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();
blockchain.randomSetupEndpoint();
const baseStore = useBaseStore();

const current = ref(''); // the current chain
const temp = ref('')
blockchain.$subscribe((m, s) => {
  if(current.value ===s.chainName && temp.value != s.endpoint.address) {
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

dayjs()

</script>

<template>
  <div class="bg-gray-100 dark:bg-[#171d30]">
    <!-- sidebar -->
    <!-- <div
      class="w-64 fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-base-100 border-r border-gray-100 dark:border-gray-700"
      :class="{ block: sidebarShow, 'hidden xl:!block': !sidebarShow }"
    > -->
    <div
      class="hidden fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-base-100 border-r border-gray-100 dark:border-gray-700"
    >
      <div class="flex justify-between mt-1 pl-4 py-4 mb-1">
        <RouterLink to="/" class="flex items-center">
          <img class="w-10 h-10" src="../../assets/logo.svg" />
          <h1 class="flex-1 ml-3 text-2xl font-semibold dark:text-white">
            Ping.pub
          </h1>
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
            class="collapse-title !py-0 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
              class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
            >
              {{ item?.title }}
            </div>
            <div
              v-if="item?.badgeContent"
              class="mr-6 badge badge-sm text-white border-none"
              :class="item?.badgeClass"
            >
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div v-for="(el, key) of item?.children" class="menu bg-base-100 w-full !p-0">
              <RouterLink
                v-if="isNavLink(el)"
                @click="sidebarShow = false"
                class="hover:bg-gray-100 dark:hover:bg-[#373f59] rounded cursor-pointer px-3 py-2 flex items-center"
                :class="{
                  '!bg-primary': selected($route, el),
                }"
                :to="el.to"
              >
                <Icon
                  v-if="!el?.icon?.image"
                  icon="mdi:chevron-right"
                  class="mr-2 ml-3"
                  :class="{
                    'text-white':
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
                  class="text-base capitalize text-gray-500 dark:text-gray-300"
                  :class="{
                    '!text-white': selected($route, el),
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
            class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
          >
            {{ item?.title }}
          </div>
          <div
            v-if="item?.badgeContent"
            class="badge badge-sm text-white border-none" 
            :class="item?.badgeClass"
          >
            {{ item?.badgeContent }}
          </div>
        </RouterLink>
        <div
          v-if="isNavTitle(item)"
          class="px-4 text-sm text-gray-400 pb-2 uppercase"
        >
          {{ item?.heading }}
        </div>
      </div>
      <div class="px-2">
          <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
            Tools
          </div>
          <RouterLink to="/wallet/suggest"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
          >
            <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
            <div
              class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
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
            class="text-sm capitalize flex-1 text-gray-600 dark:text-gray-200"
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
            class="text-sm capitalize flex-1 text-gray-600 dark:text-gray-200"
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
            class="text-sm capitalize flex-1 text-gray-600 dark:text-gray-200"
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
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
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
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
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
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            FAQ
          </div>
        </a>
      </div>
    </div>
    <!-- <div class="xl:!ml-64 px-3 pt-4"> -->
    <div class="px-3 pt-4 bg-mw-gradient">
      <!-- header -->
      <div
        class="hidden flex items-center py-3 bg-base-100 mb-4 rounded px-4 sticky top-0 z-10"
      >
        <div
          class="text-2xl pr-3 cursor-pointer xl:!hidden"
          @click="sidebarShow = true"
        >
          <Icon icon="mdi-menu" />
        </div>

        <ChainProfile />

        <div class="flex-1 w-0"></div>

        <!-- <NavSearchBar />-->
        <NavBarI18n class="hidden md:!inline-block" />
        <NavbarThemeSwitcher class="!inline-block" />
        <NavbarSearch class="!inline-block" />
        <NavBarWallet />
      </div>
      <!-- MW header -->
      <div class="pt-10 flex justify-between">
        <svg width="170" height="54" viewBox="0 0 170 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.6996 38.76C7.3399 38.76 7.88253 38.54 8.32749 38.1C8.77244 37.66 8.99492 37.1235 8.99492 36.4904V25.11L13.6669 31.6614C14.1661 32.3052 14.7901 32.6272 15.539 32.6272C16.2769 32.6272 16.9064 32.3052 17.4273 31.6614L26.2667 19.267C26.538 18.8485 26.6737 18.4139 26.6737 17.9632C26.6737 17.8344 26.6438 17.5876 26.5841 17.2227C26.5244 16.8579 26.2287 16.4877 25.6969 16.1121C25.2737 15.8223 24.8341 15.6775 24.3783 15.6775C24.2481 15.6775 24.0012 15.7123 23.6377 15.7821C23.2741 15.8518 22.897 16.1389 22.5063 16.6432L15.5389 26.4138L8.58785 16.6432C8.06692 16.0101 7.4429 15.6935 6.71578 15.6935C5.93439 15.6935 5.31037 16.0047 4.8437 16.6272C4.55068 17.0242 4.40417 17.4642 4.40417 17.9471V36.4904C4.40417 37.1235 4.62665 37.6601 5.07161 38.1001C5.51656 38.54 6.0593 38.76 6.6996 38.76ZM50.5544 38.76C51.0103 38.76 51.4498 38.6205 51.873 38.3415C52.5242 37.8693 52.8498 37.2523 52.8498 36.4904C52.8498 36.0397 52.7141 35.605 52.4428 35.1865L43.6034 22.776C43.0825 22.1429 42.4531 21.8263 41.7151 21.8263C40.9662 21.8263 40.3422 22.1429 39.843 22.776L35.171 29.3273V17.947C35.171 17.3246 34.9485 16.7907 34.5036 16.3454C34.0586 15.9001 33.516 15.6774 32.8757 15.6774C32.2354 15.6774 31.6928 15.9001 31.2478 16.3454C30.8029 16.7907 30.5804 17.3246 30.5804 17.947V36.4903C30.5804 36.984 30.7269 37.4293 31.0199 37.8264C31.4866 38.438 32.116 38.7439 32.9083 38.7439C33.6245 38.7439 34.2431 38.4273 34.7641 37.7942L41.7151 28.0236L48.6825 37.7942C49.2034 38.438 49.8273 38.76 50.5544 38.76Z" fill="url(#paint0_linear_8_68)"/>
          <path d="M62.9793 4.35483H61.6581V49.6451H62.9793V4.35483Z" fill="white"/>
          <path d="M84.9775 38.4356C84.2606 38.4356 83.6454 38.1235 83.1318 37.4992L74.1116 24.9299V29.4529C74.1116 30.0666 73.8923 30.5929 73.4536 31.032C73.0149 31.4711 72.4799 31.6906 71.8486 31.6906C71.228 31.6906 70.6956 31.4711 70.2516 31.032C69.8075 30.5929 69.5855 30.0666 69.5855 29.4529V17.8993C69.5962 17.8252 69.6042 17.7564 69.6096 17.6929C69.6149 17.6295 69.623 17.5766 69.6337 17.5342L69.6497 17.439C69.6711 17.3332 69.7032 17.2327 69.746 17.1375C69.7567 17.0952 69.7647 17.0661 69.7701 17.0502C69.7754 17.0343 69.7835 17.0158 69.7942 16.9946L69.8263 16.9312L69.8584 16.8677L69.8905 16.8042C69.8905 16.8042 69.9012 16.7857 69.9226 16.7486L69.9707 16.6772C70.0349 16.582 70.1045 16.4974 70.1794 16.4233L70.1954 16.4074C70.1954 16.4074 70.2061 16.3942 70.2275 16.3678C70.2489 16.3413 70.2623 16.3254 70.2676 16.3201C70.273 16.3149 70.3051 16.2884 70.3639 16.2408C70.4228 16.1932 70.479 16.1482 70.5325 16.1059L70.5646 16.09C70.6181 16.0477 70.6662 16.016 70.709 15.9948C70.7518 15.9736 70.7919 15.9525 70.8294 15.9313C70.8668 15.9102 70.9096 15.889 70.9578 15.8678C71.0059 15.8467 71.0541 15.8282 71.1022 15.8123L71.2226 15.7726C71.2226 15.7726 71.2627 15.762 71.343 15.7409C71.4232 15.7197 71.4741 15.7118 71.4955 15.7171L71.656 15.7012C71.656 15.7012 71.7148 15.6933 71.8325 15.6774L72.3461 15.7409C72.4959 15.7726 72.635 15.8149 72.7634 15.8678L72.7955 15.8837L72.8597 15.9155L72.9239 15.9472L72.9881 15.9789C72.9881 15.9789 73.0068 15.9895 73.0443 16.0107L73.1165 16.0583L73.2931 16.2011C73.3252 16.2223 73.3466 16.2382 73.3573 16.2487L73.3894 16.2805C73.3894 16.2805 73.4027 16.2911 73.4295 16.3122C73.4562 16.3334 73.4723 16.3466 73.4776 16.3519C73.483 16.3572 73.5097 16.3889 73.5579 16.4471C73.606 16.5053 73.6515 16.5608 73.6943 16.6138L82.7145 29.1831V17.9152C82.7145 17.3015 82.9365 16.7751 83.3805 16.336C83.8246 15.897 84.3569 15.6774 84.9775 15.6774C85.6088 15.6774 86.1438 15.897 86.5825 16.3361C87.0212 16.7751 87.2406 17.3015 87.2406 17.9152V36.1978C87.2406 36.6845 87.1015 37.1236 86.8233 37.515C86.3632 38.1287 85.7479 38.4356 84.9775 38.4356ZM71.8487 38.4356C71.2281 38.4356 70.6958 38.216 70.2517 37.777C69.8077 37.3379 69.5857 36.8115 69.5857 36.1979C69.5857 35.5842 69.8077 35.0578 70.2517 34.6188C70.6958 34.1797 71.2281 33.9601 71.8487 33.9601C72.48 33.9601 73.015 34.1797 73.4537 34.6188C73.8924 35.0578 74.1118 35.5842 74.1118 36.1979C74.1118 36.8115 73.8924 37.3379 73.4537 37.777C73.015 38.2161 72.48 38.4356 71.8487 38.4356ZM102.28 38.4356C104.388 38.4356 106.314 37.9224 108.058 36.8962C109.802 35.8699 111.193 34.4971 112.231 32.7778C113.269 31.0585 113.788 29.1567 113.788 27.0724C113.788 25.0516 113.263 23.1366 112.215 21.3274C111.198 19.624 109.834 18.2644 108.122 17.2487C107.737 17.0477 107.346 16.9472 106.95 16.9472C106.768 16.9472 106.485 16.9948 106.1 17.09C105.714 17.1852 105.351 17.5026 105.008 18.0422C104.805 18.4019 104.703 18.7723 104.703 19.1531C104.703 19.3436 104.754 19.6345 104.856 20.026C104.957 20.4175 105.276 20.7772 105.811 21.1052C106.891 21.74 107.737 22.5864 108.347 23.6444C108.957 24.7025 109.261 25.8452 109.261 27.0725C109.261 28.3315 108.948 29.4821 108.323 30.5243C107.697 31.5664 106.854 32.3996 105.795 33.0239C104.735 33.6481 103.564 33.9603 102.28 33.9602C101.006 33.9602 99.84 33.6481 98.7807 33.0239C97.7214 32.3997 96.8761 31.5665 96.2448 30.5243C95.6134 29.4821 95.2978 28.3315 95.2978 27.0725C95.2978 26.6916 95.3299 26.316 95.3941 25.9457L95.4262 25.5966C95.4262 25.1099 95.2657 24.6497 94.9447 24.2159C94.5381 23.6551 93.9389 23.3747 93.1471 23.3747C92.6549 23.3747 92.1894 23.5308 91.7507 23.8429C91.312 24.155 91.0392 24.6179 90.9322 25.2316C90.8252 25.8452 90.7717 26.4589 90.7717 27.0725C90.7717 29.1568 91.2906 31.0586 92.3285 32.7779C93.3664 34.4972 94.7548 35.87 96.4936 36.8963C98.2323 37.9226 100.161 38.4356 102.28 38.4356ZM127.799 38.4356C129.351 38.4356 130.779 38.1129 132.085 37.4675C133.39 36.8221 134.508 35.891 135.439 34.6742C137.023 32.4735 137.814 29.9343 137.814 27.0565C137.814 24.1892 137.023 21.65 135.439 19.4387C134.508 18.222 133.39 17.2909 132.085 16.6455C130.779 16.0001 129.351 15.6774 127.799 15.6774H119.582C118.95 15.6774 118.415 15.897 117.977 16.336C117.538 16.7751 117.319 17.3015 117.319 17.9151V23.4698C117.319 24.094 117.538 24.6231 117.977 25.0569C118.415 25.4906 118.95 25.7075 119.582 25.7075C120.202 25.7075 120.734 25.4906 121.179 25.0568C121.623 24.6231 121.845 24.094 121.845 23.4698V20.1529H127.799C129.768 20.1529 131.228 20.9835 132.181 22.6446C132.93 23.9565 133.304 25.4272 133.304 27.0565C133.304 28.9504 132.807 30.6009 131.812 32.0081C130.817 33.3095 129.479 33.9601 127.799 33.9601H119.581C118.95 33.9601 118.415 34.1797 117.976 34.6188C117.538 35.0578 117.318 35.5842 117.318 36.1979C117.318 36.8115 117.538 37.3379 117.976 37.777C118.415 38.2161 118.95 38.4356 119.581 38.4356H127.799ZM155.405 38.4356H143.609C142.977 38.4356 142.442 38.216 142.004 37.777C141.565 37.3379 141.346 36.8115 141.346 36.1979C141.346 35.5842 141.565 35.0578 142.004 34.6188C142.442 34.1797 142.977 33.9601 143.609 33.9601H155.405C156.026 33.9601 156.558 34.1797 157.002 34.6188C157.446 35.0578 157.668 35.5842 157.668 36.1979C157.668 36.8115 157.446 37.3379 157.002 37.777C156.558 38.2161 156.026 38.4356 155.405 38.4356ZM155.405 20.1529H143.609C142.977 20.1529 142.442 19.936 142.004 19.5023C141.565 19.0685 141.346 18.5394 141.346 17.9152C141.346 17.3016 141.565 16.7752 142.004 16.3361C142.442 15.897 142.977 15.6775 143.609 15.6775H155.405C156.026 15.6775 156.558 15.897 157.002 16.3361C157.446 16.7752 157.668 17.3016 157.668 17.9152C157.668 18.5395 157.446 19.0685 157.002 19.5023C156.558 19.9361 156.026 20.1529 155.405 20.1529ZM155.405 29.2943H143.609C142.977 29.2943 142.442 29.0774 142.004 28.6436C141.565 28.2098 141.346 27.6808 141.346 27.0565C141.346 26.4429 141.565 25.9165 142.004 25.4774C142.442 25.0384 142.977 24.8188 143.609 24.8188H155.405C156.026 24.8188 156.558 25.0384 157.002 25.4774C157.446 25.9165 157.668 26.4429 157.668 27.0566C157.668 27.6808 157.446 28.2098 157.002 28.6436C156.558 29.0774 156.026 29.2943 155.405 29.2943Z" fill="white"/>
          <defs>
          <linearGradient id="paint0_linear_8_68" x1="4.40417" y1="15.6774" x2="52.8498" y2="15.6774" gradientUnits="userSpaceOnUse">
            <stop stop-color="#EF4136"/>
            <stop offset="1" stop-color="#FBB040"/>
          </linearGradient>
          </defs>
        </svg>
        <div class="header-btn-group">
          <button>
            <div class="btn-mw rounded btn-mw--border">
              <div class="btn-mw rounded btn-mw--content">Testnets</div>
            </div>
          </button>
          <button>
            <div class="btn-mw rounded btn-mw--border active">
              <div class="btn-mw rounded btn-mw--content">Explorers</div>
            </div>
          </button>
          <button>
            <div class="btn-mw rounded btn-mw--border">
              <div class="btn-mw rounded btn-mw--content">dApps</div>
            </div>
          </button>
          <button>
            <div class="btn-mw rounded btn-mw--border">
              <div class="btn-mw rounded btn-mw--content">Tools</div>
            </div>
          </button>
          <button>
            <div class="btn-mw rounded btn-mw--border">
              <div class="btn-mw rounded btn-mw--content">About</div>
            </div>
          </button>
          <button class="btn">Connect wallet</button>
        </div>
      </div>

      <!-- 👉 Pages -->
      <div style="min-height: calc(100vh - 180px);">
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
      </div>

      <newFooter />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .rounded {
    border-radius: 100px;
  }

  .btn-mw {
    &--border {
      padding: 1px;
      border-radius: 100px;
      background: transparent;
      &.active, &:hover {
        background-image: linear-gradient(90deg, #EF4136 , #FBB040);

        .btn-mw--content {
          background: #292934;
        }
      }
    }

    &--content {
      border: 0px;
      padding: 8px 16px;
      background: transparent;
    }
  }

  .header-btn-group {
    display: flex;
    gap: 40px;
  }

  .bg-mw-gradient {
    background-image: url('../../assets/images/background.svg');
  }
</style>