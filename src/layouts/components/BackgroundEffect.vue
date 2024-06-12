<template>
    <div id="mw-background-effect" class="mw-background-effect">
      <div class="relative h-full overflow-hidden">
        <div class="absolute mw-background-effect--item-top">
        </div>
        <div class="absolute mw-background-effect--item-bottom">
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.mw-background-effect {
  position: absolute;
  z-index: -9999;
  width: 100%;
  height: 100%;
  &--item-top {
    background-image: url('../../assets/images/background-orange-item-top.svg');
    width: 40vw;
    height: 45vw;
    background-size: cover;
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    transform: translate(-30%, -30%);
  }
  &--item-bottom {
    background-image: url('../../assets/images/background-orange-item-bottom.svg');
    width: 30vw;
    height: 42vw;
    background-size: cover;
    background-repeat: no-repeat;
    bottom: 0;
    right: 0;
    transform: translate(50%, 50%);
  }
}
</style>