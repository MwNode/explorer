<script lang="ts" setup>
import { useDashboard } from '@/stores/useDashboard';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const dashboardStore = useDashboard();
const conf = computed(() => dashboardStore.chains[props.name] || {});

const addFavor = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
  dashboardStore.favoriteMap[props.name] =
    !dashboardStore?.favoriteMap?.[props.name];
  window.localStorage.setItem(
    'favoriteMap',
    JSON.stringify(dashboardStore.favoriteMap)
  );
};
</script>
<template>
  <RouterLink
    :to="`/${name}`"
    class="cursor-pointer"
  >
    <div class="text-main rounded-3xl md:rounded-32 shadow btn-mw-gradient-hover--outside border-white-10">
      <div class="btn-mw-gradient-hover--inside bg-white-5 flex justify-between items-end rounded-3xl md:rounded-32">
        <div class="flex md:!flex-col flex-row content-center">
          <div class="rounded-full overflow-hidden mr-3 md:ml-0">
            <img class="chain-logo" :src="conf.logo" />
          </div>
          <div class="font-semibold mb-0 md:mt-3 flex-1 truncate capitalize chain-name text-lg leading-normal">
            {{ conf?.prettyName || props.name }}
          </div>
        </div>
        <div>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 20.6262C18.9024 21.0167 18.9024 21.6499 19.2929 22.0404C19.6834 22.431 20.3166 22.431 20.7071 22.0404L26.7476 16L20.7071 9.95956C20.3166 9.56903 19.6834 9.56903 19.2929 9.95956C18.9024 10.3501 18.9024 10.9832 19.2929 11.3738L22.9191 15L6.66667 15C6.11438 15 5.66667 15.4477 5.66667 16C5.66667 16.5523 6.11438 17 6.66667 17L22.9191 17L19.2929 20.6262Z" fill="white"/>
          </svg>
        </div>
        <!-- <div
          @click="addFavor"
          class="pl-4 text-xl"
          :class="{
            'text-warning': dashboardStore?.favoriteMap?.[props.name],
            'text-gray-300 dark:text-gray-500':
              !dashboardStore?.favoriteMap?.[props.name],
          }"
        >
          <Icon icon="mdi-star" />
        </div> -->
      </div>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.btn-mw-gradient-hover--inside {
  padding: 20px 24px;
}

.chain-logo {
  object-fit: contain;
  object-position: center;
  max-width: 2rem;
  max-height: 2rem;
  width: 100%;
  height: 100%;
}
</style>
