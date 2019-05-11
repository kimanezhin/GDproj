<template>
  <div id="main" @scroll="paginataion($event)">
    <div id="drop">
      <div class="sub-header">
        <!-- <div class="channel-name" @click.prevent="showChannels"> -->
        <DropDown/>

        <!-- </div> -->

        <div class="icon">
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 490.3 490.3"
            style="enable-background:new 0 0 490.3 490.3;"
            xml:space="preserve"
          >
            <g>
              <g>
                <path
                  d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
			s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
			c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
			C27.9,58.95,0,86.75,0,121.05z"
                ></path>
                <path
                  d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
			c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
			C380.6,325.15,380.6,332.95,385.4,337.65z"
                ></path>
              </g>
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </svg>
        </div>
      </div>
    </div>
    <Navbar id="nv"></Navbar>

    <Logout/>
    <div class="row">
      <div class="col-md-2 mt-5" id="menu">
        <feedMenu></feedMenu>
      </div>
      <news v-bind:posts="arr"/>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import Vue from "vue";
import store from "../store/store.js";
import VueNativeSock from "vue-native-websocket";
import dataStorage from "../store/modules/dataStorage.js";
import feedMenu from "./Menu/feedMenu";
import Navbar from "./Navbar";
const vm = new Vue();
import { mapState, mapGetters } from "vuex";
import smoothReflow from "vue-smooth-reflow";
import News from "./News/News";
import Logout from "./Logout";
import DropDown from "./News/DropDown";
export default {
  mixins: [smoothReflow],
  components: {
    feedMenu,
    Navbar,
    News,
    DropDown,
    Logout
  },
  data() {
    return {
      flag: false,
      isEditorShown: false,
      currentSize: "51px",
      inputText: "",
      readyToClose: false,
      myText: "he",
      arr: [],
      eventFlag: true,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      // arr: "GET_POSTS",
      token: "GET_TOKEN"
    }),
    myArr() {
      return this.$store.getters.GET_POSTS;
    }
  },
  methods: {
    pagination(event) {
      let wrapper = event.target.scrollingElement,
        offsetHeight = wrapper.offsetHeight,
        scrollHeight = wrapper.scrollHeight,
        scrollTop = wrapper.scrollTop,
        actualHeight = scrollHeight - offsetHeight;
      if (actualHeight - scrollTop <= 2 && !this.loading) {
        this.loading = true;
        let arr = this.$store.getters.GET_POSTS;

        let index = arr[arr.length - 1].postId;
        let promise;
        if (!localStorage.getItem("channel")) {
          promise = this.$store.dispatch("FETCH_DATA", index);
        } else {
          let id = parseInt(JSON.parse(localStorage.getItem("channel")).id);
          let data = {
            direction: "backward",
            limit: 20,
            exclusiveFrom: index,
            request: id
          };
          let request = {
            type: true,
            request: data
          };
          console.log(data);
          promise = this.$store.dispatch("UPDATE_POSTS", request);
        }
        promise
          .then(() => {
            console.log("update!");
            this.$eventHub.$emit("feed-updated");
            this.loading = false;
          })
          .catch(() => {
            console.log("some troubles in pagination");
            this.loading = false;
          });
      }
    },
    getName(id, num) {
      let name = "";
      axios
        .get("http://websuck1t.herokuapp.com/users/" + id)
        .then(
          response =>
            (this.arr[num].name =
              response.data.userName.firstName +
              " " +
              response.data.userName.secondName)
        );
    },
    closeEditor() {
      // this.readyToClose = false;
      this.readyToClose = true;

      document.getElementById("myText").style.height = "51px";
      document.getElementById("myText").style.width = "65%";
      this.isEditorShown = false;

      document
        .getElementsByClassName("toOverlay")[0]
        .classList.remove("extendedOverlay");
    },
    sendPost() {},

    test() {},
    onOptionSelect(selected) {},
    setInitialSize() {
      {
        document.getElementById("myText").style.height = "51px";
        document.getElementById("myText").style.width = "65%";

        document
          .getElementsByClassName("toOverlay")[0]
          .classList.remove("extendedOverlay");
        this.isEditorShown = false;
      }
    },

    showChannels() {
      let list = document.getElementsByClassName("shevron");
      if (list[0].classList.contains("shevron-down")) {
        list[0].classList.remove("shevron-down");
      } else list[0].classList.add("shevron-down");
    },
    setCurrentSize() {
      this.isEditorShown = true;

      document.getElementById("myText").style.height = "auto";
      document.getElementById("myText").style.width = "30vw";
      document.getElementById("myText").style.height = this.currentSize;

      document.getElementById("fantomPage").style.height =
        document.getElementById("main").scrollHeight + "px";

      document
        .getElementsByClassName("toOverlay")[0]
        .classList.add("extendedOverlay");
    },
    getPosts(i) {
      return this.arr.filter(post => parseInt(post.num) == i);
    },
    changeState() {
      vm.$disconnect();
    },

    resize() {
      var text = document.getElementById("myText");
      if (text) {
        text.style.height = "auto";
        text.style.height = text.scrollHeight + 1 + "px";
        this.currentSize = text.scrollHeight + 1 + "px";
      }

      var flag = true;
    },
    delayedResize() {
      window.setTimeout(this.resize, 0);
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.pagination);
    let removeEvents = (type, name) => {
      window.removeEventListener(type, name);
    };
    removeEvents("change", this.resize);
    removeEvents("cut", this.delayedResize);
    removeEvents("paste", this.delayedResize);
    removeEvents("drop", this.delayedResize);
    removeEvents("keydown", this.delayedResize);
  },
  beforeCreate() {
    this.$store.dispatch("SET_MY_ID");
  },
  mounted() {
    window.addEventListener("scroll", this.pagination);
    //fixed textarea
    var observe;
    if (window.attachEvent) {
      observe = function(element, event, handler) {
        element.attachEvent("on" + event, handler);
      };
    } else {
      observe = function(element, event, handler) {
        if (element) element.addEventListener(event, handler, false);
      };
    }

    var text = document.getElementById("myText");

    /* 0-timeout to get the already changed text */

    observe(text, "change", this.resize);
    observe(text, "cut", this.delayedResize);
    observe(text, "paste", this.delayedResize);
    observe(text, "drop", this.delayedResize);
    observe(text, "keydown", this.delayedResize);
    if (text) {
      text.focus();
      text.select();
    }
    this.resize();
    document.activeElement.blur();
  }
};
</script>
<style>
html{
  background-color: #fff;
}
</style>

<style scoped>
#drop {
  display: none;
}

.exit:hover {
  cursor: pointer;
}

#submitButton {
  margin-right: 2%;
  margin-bottom: 1%;
}

/* .listP-enter-active,
.listP-leave-active {
  transition: all 1s;
}
.listP-enter, .listP-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.listP-move {
  transition: transform 1s;
} */

read-more[less-str] {
  color: red;
  text-emphasis: none;
  text-decoration: none;
}

.find {
  height: 7vh;
  display: flex;
  flex-direction: row;
  margin-left: 20%;
  margin-top: 10px;
  width: 30vw;
}

.findBox {
  border: 2px solid black;
  width: 20vw;
}
/* .text {
  width: 25vw;
} */
div {
  max-width: 100%;
}
.postHeader {
  display: flex;
}
img {
  width: 51px;
  height: 51px;
}
.title,
.smth {
  font-size: 30px;
}
.title {
  color: #a2a2a2;
}
.smth {
  display: flex;
  flex-direction: column;
}
.smth > a {
  text-emphasis: none;
  text-decoration: none;
}

.sub-header {
  width: 100%;
  height: 50px;
  background-color: #373a47;
  margin-top: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.icon {
  /* justify-self: flex-end; */
  width: 35px;
  height: 35px;
  fill: white;
  stroke: white;
  stroke-width: 5;
  margin-right: 1%;
  margin-left: auto;
}

.openButton {
  margin-left: auto;
  color: white;
}

.channel-name:hover {
  cursor: pointer;
}

#main{
  height: 100vh;
}

#sendIco {
  font-size: 30px;
  color: rgb(45, 49, 49);
}
.newPost {
  margin-left: 20vw;
  margin-top: 5vh;
  width: 61vw;
  display: flex;
  flex-direction: row;
}

.newPostBottom {
  margin-left: 25%;
  flex-direction: row;
  display: flex;
  width: 52vw;
  justify-content: space-between;
}

#newPostButton {
  background-color: #373a47;
  border-radius: 30px;
}

@media screen and (max-width: 1200px) {
  #menu {
    display: none;
  }

  .exit {
    display: none;
  }
  #drop {
    display: initial;
  }
  div {
    margin: 0;
  }

  .text {
    width: 100vw;
  }

  .post {
    width: 55vw;
  }
}
</style>
