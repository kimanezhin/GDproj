<template>
  <div id="main">
    <Navbar id="nv"></Navbar>
    <channel-drop-down id="drop" @select-item="onOptionSelect">
      <!-- <template slot="item" slot-scope="option">
        <span>
          <img :src="option.thumbnail">
        </span>
      </template>-->
    </channel-drop-down>
    <div class="exit" @click="logOut">Log out</div>
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
import ChannelDropDown from "./ChannelDropDown";
export default {
  mixins: [smoothReflow],
  components: {
    feedMenu,
    Navbar,
    News,
    ChannelDropDown
  },
  data() {
    return {
      flag: false,
      isEditorShown: false,
      currentSize: "51px",
      inputText: "",
      readyToClose: false,
      myText: "he",
      arr: []
    };
  },
  computed: {
    ...mapGetters({
      // arr: "GET_POSTS",
      token: "GET_TOKEN"
    }),
    myArr() {
      return this.$store.getters.GET_POSTS;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("LOG_OUT").then(() => {
        this.$router.push("/");
      });
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
    onOptionSelect(selected) {
      console.log(selected);
    },
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

      text.style.height = "auto";
      text.style.height = text.scrollHeight + 1 + "px";
      this.currentSize = text.scrollHeight + 1 + "px";

      var flag = true;
    },
    delayedResize() {
      window.setTimeout(this.resize, 0);
    }
  },
  mounted() {

    //fixed textarea
    var observe;
    if (window.attachEvent) {
      observe = function(element, event, handler) {
        element.attachEvent("on" + event, handler);
      };
    } else {
      observe = function(element, event, handler) {
        element.addEventListener(event, handler, false);
      };
    }

    var text = document.getElementById("myText");

    /* 0-timeout to get the already changed text */

    observe(text, "change", this.resize);
    observe(text, "cut", this.delayedResize);
    observe(text, "paste", this.delayedResize);
    observe(text, "drop", this.delayedResize);
    observe(text, "keydown", this.delayedResize);

    text.focus();
    text.select();
    this.resize();
    document.activeElement.blur();
  },
  created() {
    this.$store.dispatch("FETCH_DATA");
  },
  watch: {
   
  }
};
</script>

<style scoped>
#drop {
  display: none;
}

.exit {
  font-weight: 600;
  /* margin-left: 98%; */
  /* float: right; */
  font-size: 30px;
  top: 65px;
  position: absolute;
  right: -0.8em;
  /* margin: 0; */
  margin-left: 99%;
  -webkit-transform: rotate(-90deg); /* разворот текста для разных браузеров */
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
    width: 85vw;
  }
}
</style>
