<template>
    <div id="mw-background-effect" class="mw-background-effect">
      <div class="relative h-full overflow-hidden">
        <svg class="absolute mw-background-effect--item-top" width="594" height="660" viewBox="0 0 594 660" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M293.163 7.00418C386.438 29.1899 405.903 148.366 464.594 224.18C510.156 283.035 593.844 321.182 594 395.612C594.156 470.09 524.43 522.459 465.313 567.762C415.314 606.077 355.382 616.311 293.163 626.151C212.076 638.974 114.167 690.708 56.335 632.44C-1.50979 574.16 70.9544 477.459 64.3459 395.612C56.4585 297.927 -34.9941 201.63 14.7316 117.179C67.3793 27.7659 192.218 -17.006 293.163 7.00418Z" fill="url(#paint0_linear_743_1383)"/>
          <defs>
          <linearGradient id="paint0_linear_743_1383" x1="0" y1="0.583496" x2="594" y2="0.583496" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F73232"/>
          <stop offset="1" stop-color="#FF7D16"/>
          </linearGradient>
          </defs>
        </svg>
        <svg class="absolute mw-background-effect--item-bottom" width="525" height="607" viewBox="0 0 525 607" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M284.75 2.30859C373.554 13.7039 422.392 106.057 471.403 180.998C508.174 237.223 530.778 300.878 523.71 367.691C517.338 427.914 478.495 475.832 435.68 518.653C392.868 561.472 345.25 604.387 284.75 606.686C222.507 609.051 168.899 571.46 121.899 530.576C70.2343 485.635 23.0833 434.913 9.9984 367.691C-6.15042 284.728 -7.63647 193.593 43.1564 126.046C99.6912 50.8621 191.46 -9.66245 284.75 2.30859Z" fill="url(#paint0_linear_769_1382)"/>
          <defs>
          <linearGradient id="paint0_linear_769_1382" x1="0" y1="0.791748" x2="525" y2="0.791748" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F73232"/>
          <stop offset="1" stop-color="#FF7D16"/>
          </linearGradient>
          </defs>
        </svg>
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
    width: 41.25vw;
    height: 45.76vw;
    top: 0;
    left: 0;
    transform: translate(-15vw, -20vw);
    filter: blur(15vw);
  }
  &--item-bottom {
    width: 36.45vw;
    height: 42vw;
    bottom: 0;
    right: 0;
    transform: translate(25vw, 25vw);
    filter: blur(15vw);
  }
}
</style>