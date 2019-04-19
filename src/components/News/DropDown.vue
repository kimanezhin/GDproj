<template>
  <div class="channel-name">
    <div class="menu" @click="showOrHideMenu">
      <div class="flex-display">
        Menu
        <div class="shevron shevron-down">
          <!-- Svg Vector Icons : http://www.onlinewebfonts.com/icon -->
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 1000 1000"
            enable-background="new 0 0 1000 1000"
            xml:space="preserve"
          >
            <metadata>Svg Vector Icons : http://www.onlinewebfonts.com/icon</metadata>
            <g>
              <path
                d="M981.9,283c5.2-5.2,8.1-12.1,8.1-19.4c0-7.3-2.8-14.2-8-19.3c-10.7-10.7-28-10.7-38.7-0.1L498.9,686.4L56.8,244.2c-10.7-10.7-28.1-10.7-38.7,0c-5.2,5.2-8,12.1-8,19.4c0,7.3,2.8,14.2,8,19.4l480,479.9l0.9,0.9L981.9,283z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <div class="itemList">
        <div class="item" v-for="(channel, index) in channelList" :key="index">
          <div class="content">
            <div class="menuIcon" @click="openSettings">
              <font-awesome-icon icon="cog"/>
            </div>
            <div class="subContent" style="width:100%;" @click="changeChannel">{{channel.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    channelList() {
      return this.$store.getters.GET_CHANNELS;
    }
  },
  mounted() {
    let menu = document.getElementsByClassName("menu")[0];
    //    this.showOrHideMenu();

    let list = document.getElementsByClassName("shevron");
    let channelName = document.getElementsByClassName("channel-name");
    let flag = false;
    channelName[0].addEventListener("mouseover", () => {
      flag = true;
    });
    channelName[0].addEventListener("mouseleave", () => {
      flag = false;
    });

    document.onmouseup = () => {
      if (!flag && !list[0].classList.contains("shevron-down")) {
        this.showOrHideMenu();
      }
    };
  },
  methods: {
    slideUp(target, duration) {
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.boxSizing = "border-box";
      target.style.height = target.offsetHeight + "px";
      target.style.height = 0; /* [4] */
      target.style.paddingTop = 0; /* [5.1] */
      target.style.paddingBottom = 0; /* [5.2] */
      target.style.marginTop = 0; /* [6.1] */
      target.style.marginBottom = 0; /* [7.2] */
      target.style.overflow = "hidden"; /* [7] */
      window.setTimeout(() => {
        target.style.display = "none"; /* [8] */
        target.style.removeProperty("height"); /* [9] */
        target.style.removeProperty("padding-top"); /* [10.1] */
        target.style.removeProperty("padding-bottom"); /* [10.2] */
        target.style.removeProperty("margin-top"); /* [11.1] */
        target.style.removeProperty("margin-bottom"); /* [11.2] */
        target.style.removeProperty("overflow"); /* [12] */
        target.style.removeProperty("transition-duration"); /* [13.1] */
        target.style.removeProperty("transition-property"); /* [13.2] */
      }, duration);
    },
    slideDown(target, duration) {
      target.style.removeProperty("display");
      let display = window.getComputedStyle(target).display;

      if (display === "none") display = "block";

      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.boxSizing = "border-box";
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
      }, duration);
    },
    slideToggle(target, duration) {
      if (window.getComputedStyle(target).display === "none") {
        return this.slideDown(target, duration);
      } else {
        return this.slideUp(target, duration);
      }
    },
    rotateChevron() {
      let list = document.getElementsByClassName("shevron");
      if (list[0].classList.contains("shevron-down")) {
        list[0].classList.remove("shevron-down");
      } else list[0].classList.add("shevron-down");
    },
    showOrHideMenu() {
      this.rotateChevron();

      let subm = document.getElementsByClassName("item");
      for (let i = 0; i < subm.length; ++i) {
        this.slideToggle(subm[i], 500);
      }
    },
    openSettings() {
      console.log("a");
    },
    changeChannel() {
      console.log("b");
    }
  }
};
</script>


<style>
.menuIcon {
  color: #ffffff80;
  margin-left: 5px;
  margin-right: 10px;
  font-size: 15px;
}
.content {
  width: 100%;
  display: flex;

  /* justify-content: center; */
  align-items: center;
}
.menu {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 100%;
}
.flex-display {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}
.item {
  height: 40px;
  /* width: 200px; */
  width: 100%;
  /* left: -15px; */
  /* border-radius: 12px; */
  position: relative;
  background-color: #373a47;
  /* color: black; */
  cursor: pointer;
  display: none;
}

.item::after {
  content: "";
  width: 100%;
  height: 1px;
  background-color: #c8c8c8;
  position: absolute;
  margin-top: 9px;
}

.item:hover {
  background-color: #3f414a;
}

.itemList {
  position: absolute;
  z-index: 5000;
  margin-top: 10px;
  width: 100%;
}

.animate {
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  /* -ms-transition: all .5s; */
  transition: all 0.5s;
  opacity: 1;
}

.channel-name {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-self: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
  width: 100%;
  text-decoration: underline;
}

.shevron {
  width: 15px;
  height: 15px;
  fill: white;
  stroke: white;

  stroke-width: 50;
  margin-left: 5px;
  transform: rotate(180deg);
  transform-origin: 50% 110%;
  transition: all 0.3s ease;
}

.shevron-down {
  transition: all 0.3s ease;
  cursor: pointer;
  transform: rotate(0deg);
  transition-delay: 0.5s ease;
}
</style>