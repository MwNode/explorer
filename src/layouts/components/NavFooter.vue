<script lang="ts" setup>
import Logo from './Logo.vue';

</script>

<template>
  <!-- footer -->
  <footer
    class="flex items-center md:h-12 mt-5 text-sm pt-2 z-10 w-full pb-10 md:pb-2"
  >
    <div class="flex flex-1 flex-col md:!flex-row justify-center md:!justify-between items-center">
      <!-- <Logo /> -->
      <img class="logo md:hidden" src="../../assets/mw-logo.svg">
      &copy;&nbsp;
      {{ new Date().getFullYear() }}&nbsp;. All rights reserved
      
      <!-- Made With&nbsp;
      <img src="../../assets/images/heart.svg" />&nbsp;
      By&nbsp;
      <a
        class="link link-primary no-underline"
        href="https://mwdev.mwnode.com/"
        target="_blank"
        rel="noopener noreferrer"
        >MWdev.mwnode.com</a
      > -->
    </div>
    <!-- <div
      class="hidden md:!block"
    >
      <a
        class="link link-primary no-underline mr-4"
        href="https://github.com/ping-pub/explorer/blob/master/LICENSE"
        target="noopener noreferrer"
        >License</a
      >
      <a
        class="link link-primary no-underline"
        href="https://github.com/ping-pub/explorer"
        target="noopener noreferrer"
        >Github</a
      >
    </div> -->
  </footer>
</template>

<style lang="scss" scoped>
footer img.logo {
  max-width: 100px;
  width: 100%;
}
</style>