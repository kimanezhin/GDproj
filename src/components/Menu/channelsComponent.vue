<template>
  <div>
    <modal name="editChannel">Hello</modal>
    <div class="ml-4 title">channels</div>
    <div class="ml-2 smth">
      <div
        class="d-flex flex-row hrefOption"
        v-on:mouseover="makeVisible(index)"
        v-for="(channel,index) in channels"
        :key="channel.num"
        v-on:mouseleave="makeInvisible(index)"
      >
        <a
          href="#"
          :class="{bold:boldText(index)}"
          v-on:click="changeChannel(index)"
          :content="channel "
        >{{channel}}</a>
        <div :name="index" v-on:click="showModal(index)" class="channelOption">
          <font-awesome-icon icon="cog"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMenu from './modalMenu'
export default {
  components:{
    modalMenu
  },
  props: {
    channels: Array
  },
  data() {
    return {
      currentChannel: 0
    };
  },
  methods: {
    boldText(index) {
      return index == this.currentChannel;
    },
    showModal(id) {
      this.$modal.show(modalMenu,{hashId:id})
    },
    makeVisible(index) {
      // document.getElementsByClassName('channelOption')[0].classList.add('middleOpacity');
      document.getElementsByName(index)[0].classList.add("middleOpacity");
    },
    makeInvisible(index) {
      // document.getElementsByClassName('channelOption')[0].classList.add('middleOpacity');
      document.getElementsByName(index)[0].classList.remove("middleOpacity");
    },
    changeChannel(index) {
      this.currentChannel = index;
    }
  }
};
</script>
<style>
.channelOption {
  position: absolute;
  margin-left: 8vw;
  font-size: 15px;
  text-align: center;
  align-self: center;
  color: #94969c;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.middleOpacity {
  opacity: 0.5;
}

.middleOpacity:hover {
  opacity: 0.8;
}
.channelOption:hover {
  cursor: pointer;
}
.hrefOption:hover {
  background-color: rgba(200, 200, 200, 0.2) !important;
}
.hrefOption {
  width: 10vw;
}
.smth {
  display: flex;
  flex-direction: column;
}

.current {
  color: black;
}

.title,
.smth {
  font-size: 19px;
}
.title {
  /* color: #a2a2a2; */
  opacity: 0.8;
}

.smth > div > a {
  text-emphasis: none;
  text-decoration: none;

  color: black;
}
.bold {
  font-weight: bold;
  font-size: 22px;
}

.smth > div > a:hover {
  /* background-color:	rgba(200, 200, 200, .2) !important; */
}
</style>
