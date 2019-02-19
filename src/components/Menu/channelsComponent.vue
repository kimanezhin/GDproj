<template>
  <div>
    <div class="ml-4 title">channels </div>
    <div class="ml-2 smth">
      <a
        href="#"
        :class="{bold:boldText(index)}"
        v-on:click="changeChannel(index)"
        :content="channel "
        v-for="(channel,index) in channels"
        :key="channel.num"
      >{{channel}}</a>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    channels: Array
  },
  data() {
    return {
      currentChannel: 0,
    };
  },
  methods: {
    boldText(index) {
      return index == this.currentChannel;
    },
    changeChannel(index) {
      this.currentChannel = index;
    }
  }
};
</script>
<style>
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

.smth > a {
  text-emphasis: none;
  text-decoration: none;
  width:11vw;
  color: black;
}
.bold {
  font-weight: bold;
  font-size: 22px;
}

.smth > a:hover{
  background-color:	rgba(200, 200, 200, .2) !important;
}
</style>
