<template>
  <div>
    <modal name="editChannel">Hello</modal>
    <div class="ml-4 title">
      channels
      <!-- <font-awesome-icon icon = "plus" id = "add" v-on:click = "createNewChannel"/> -->
      <svg
        id="add"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        enable-background="new 0 0 24 24"
        width="17"
        v-on:click="createNewChannel"
        class="mb-2"
      >
        <path
          d="m23,10h-8.5c-0.3,0-0.5-0.2-0.5-0.5v-8.5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v8.5c0,0.3-0.2,0.5-0.5,0.5h-8.5c-0.6,0-1,0.4-1,1v2c0,0.6 0.4,1 1,1h8.5c0.3,0 0.5,0.2 0.5,0.5v8.5c0,0.6 0.4,1 1,1h2c0.6,0 1-0.4 1-1v-8.5c0-0.3 0.2-0.5 0.5-0.5h8.5c0.6,0 1-0.4 1-1v-2c0-0.6-0.4-1-1-1z"
        ></path>
      </svg>
    </div>
    <div class="ml-2 smth">
      <div :name="-2" class="d-flex flex-row hrefOption">
        <a
          href="#"
          :class="{bold:boldText(-2)}"
          class="ml-2"
          :name="-2"
          v-on:click="setDefaultChannel($event)"
        >Feed</a>
      </div>

      <div
        class="d-flex flex-row hrefOption"
        v-on:mouseover="makeVisible(index)"
        v-for="(channel,index) in channelList"
        :key="index"
        v-on:mouseleave="makeInvisible(index)"
        :name="channel.id"
      >
        <a
          href="#"
          :class="{bold:boldText(index)}"
          class="ml-2"
          :name="channel.id"
          v-on:click="changeChannel(index,$event)"
          :content="channel.name"
        >{{cutName(channel.name)}}</a>
        <div
          :name="index"
          :tabindex="channel.id"
          v-on:click="showModal(index)"
          class="channelOption"
        >
          <font-awesome-icon :name="channel.id" icon="cog"/>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import modalMenu from "./modalMenu";

import _ from "lodash";
export default {
  components: {
    modalMenu,
  },
  data() {
    return {
      currentChannel: 0,

      channels: [],
      flag: false
    };
  },
  computed: {
    channelList() {
      return this.$store.getters.GET_CHANNELS;
    }
  },
  mounted() {
    this.$store.dispatch("GET_ALL_CHANNELS");
    if (!localStorage.getItem("currentChannel")) {
      localStorage.setItem("currentChannel", -2);
    }
    this.currentChannel = parseInt(localStorage.getItem("currentChannel"));
  },
  methods: {
    
    cutName(name) {
      if (name.length > 7) {
        return name.slice(0, 7) + "..";
      }
      return name;
    },
    boldText(index) {
      return index == this.currentChannel;
    },
    createNewChannel() {
      this.showModal(-1);
    },
    showModal(id) {
      this.$modal.show(
        modalMenu,
        { hashId: id },
        {
          adaptive: true,
          height: "auto"
        }
      );
    },
    makeVisible(index) {
      // document.getElementsByClassName('channelOption')[0].classList.add('middleOpacity');
      document.getElementsByName(index)[0].classList.add("middleOpacity");
    },
    makeInvisible(index) {
      // document.getElementsByClassName('channelOption')[0].classList.add('middleOpacity');
      document.getElementsByName(index)[0].classList.remove("middleOpacity");
    },
    changeChannel(index, event) {
      let tmp = _.find(this.channelList, { id: parseInt(event.target.name) });
      let i = JSON.stringify(tmp);
      localStorage.setItem("channel", JSON.stringify(tmp));
      this.$store.dispatch("CHANGE_CHANNEL", tmp).then(() => {
        this.currentChannel = index;
        localStorage.setItem("currentChannel", index);
        this.$eventHub.$emit("change-channel", [index, tmp]);
      });
    },
    setDefaultChannel(event) {
      if (parseInt(event.target.name) == -2) {
        this.$store.dispatch("CHANGE_CHANNEL", {});
      }
      
      this.currentChannel = -2;
      localStorage.removeItem("channel");
      localStorage.setItem("currentChannel", -2);
      this.$eventHub.$emit("change-channel", [-1, null]);
    }
  },
  watch: {
    channelList: function(newVal, oldVal) {
      if (newVal[0] && !this.flag) {
        this.currentChannel = localStorage.getItem("currentChannel");
        this.flag = true;
      }
    }
  }
};
</script>

<style>
#add {
  margin-top: 4px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
#add:hover {
  cursor: pointer;
  opacity: 0.9;
}

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
<style scoped>
</style>