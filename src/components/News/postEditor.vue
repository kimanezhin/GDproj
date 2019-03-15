<template>
  <div>
    <modal name="md">
      <vue-markdown>{{editorText}}</vue-markdown>
    </modal>
    <div v-show="isEditorShown" @click="closeEditor" id="fantomPage"></div>
    <div class="d-flex flex-row mb-5" style="width:40vw;">
      <img :src="imgSource" class="toAppend">
      <div class="toOverlay" id="ovr">
        <multiselect
          v-model="value"
          tag-placeholder="Add this as new tag"
          placeholder="Search or add a tag"
          label="name"
          track-by="code"
          :options="options"
          :multiple="true"
          :taggable="true"
          :max-height="600"
          :disabled="!isEditorShown"
          @tag="addTag"
        ></multiselect>
        <textarea
          id="myText"
          @click="setCurrentSize"
          class="ml-3"
          placeholder="Кокошко для поста"
          ref="container"
          v-model="inputText"
        ></textarea>

        <div class="attachments mr-auto" v-if="isEditorShown">
          <!-- <div @click="showMyModal" v-if="isPreviewReady" class="preview mr-2">Предпросмотр</div> -->
          <svg
            height="35px"
            viewBox="0 0 496 496"
            width="35px"
            xmlns="http://www.w3.org/2000/svg"
            @click="showMyModal"
            class="mr-2"
            v-if="isPreviewReady"
          >
            <path
              d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2
		s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025
		c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
		C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7
		c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"
            ></path>
          </svg>
          <!-- <div class="addSmth">
            <div>
              <font-awesome-icon icon="user"/>
            </div>
            <div>
              <font-awesome-icon icon="user"/>
            </div>
            <div>
              <font-awesome-icon icon="user"/>
            </div>
          </div>-->
          <input type="submit" @click="sendPost" id="submitButton" class="btn btn-secondary">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import multiselect from "vue-multiselect";
import smoothReflow from "vue-smooth-reflow";
import vueMarkdown from "vue-markdown";
import Axios from "axios";
export default {
  mixins: [smoothReflow],
  components: {
    vueMarkdown,
    multiselect
  },
  data() {
    return {
      flag: true,
      isEditorShown: false,
      currentSize: "51px",
      inputText: "",
      readyToClose: false,
      isPreviewReady: false,
      editorText: "",
      imgSource:"",
      value: [],
      options: [
        { name: "#Vue.js", code: "vu" },
        { name: "#Javascript", code: "js" },
        { name: "#OpenSource", code: "os" },
        { name: "#Open", code: "oss" },
        { name: "#Op", code: "ods" },
        { name: "#O", code: "fos" }
      ]
    };
  },
  methods: {
    getImgUrl() {
      
      Axios.post(
        this.$store.getters.GET_URL + "/authentication/me",
        {},
        { withCredentials: true }
      ).then(resp => {
        
        this.imgSource =  require("../../../img/" + resp.data + ".png");
      });
    },
    addTag(newTag) {
      var t = newTag.lastIndexOf("#");
      if (t !== -1) newTag = newTag.slice(t + 1);
      newTag = "#" + newTag;
      var reg = newTag.match(/#{1}[a-zA-Zа-яА-Я0-9]+/g);
      if (reg) {
      }

      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    showMyModal() {
      this.editorText = document.getElementById("myText").value;
      this.$modal.show("md");
    },
    closeEditor() {
      // this.readyToClose = false;
      console.log("1");
      let myText = document.getElementById("myText");
      // myText.setAttribute('readonly')
      if (this.isEditorShown && myText.readOnly == false) {
        console.log("here and");
        myText.readOnly = true;
      }

      this.readyToClose = true;

      myText.style.height = "51px";
      myText.style.width = "65%";
      this.isEditorShown = false;

      document
        .getElementsByClassName("toOverlay")[0]
        .classList.remove("extendedOverlay");
    },
    sendPost() {
      this.closeEditor();
      // this.$store.dispatch("SET_DRAFT", this.inputText).then(() => {
      this.$store
        .dispatch("SEND_POST", [this.inputText, this.value])
        .then(() => {
          this.inputText = "";
          // this.value = [];
          // });
        });
      setTimeout(function() {
        document
          .getElementsByClassName("toOverlay")[0]
          .classList.add("animate");

        setTimeout(function() {
          document
            .getElementsByClassName("toOverlay")[0]
            .classList.add("zeroOpacity");
        }, 200);

        setTimeout(function() {
          document
            .getElementsByClassName("toOverlay")[0]
            .classList.remove("animate");
        }, 850);
        setTimeout(function() {
          document
            .getElementsByClassName("toOverlay")[0]
            .classList.remove("zeroOpacity");
        }, 1000);
      }, 1000);
    },

    setInitialSize() {
      {
        myText.style.height = "21px";
        myText.style.width = "65%";

        document
          .getElementsByClassName("toOverlay")[0]
          .classList.remove("extendedOverlay");
        document.getElementById("ovr").classList.remove("toOverlay");
        this.isEditorShown = false;
      }
    },
    setCurrentSize() {
      let myText = document.getElementById("myText");
      console.log("2");
      this.isEditorShown = true;
      myText.style.height = "auto";
      myText.style.width = "55vw";
      myText.style.height = this.currentSize;

      document.getElementById("fantomPage").style.width =
        this.$store.getters.GET_WIDTH + "px";
      document.getElementById("fantomPage").style.height =
        this.$store.getters.GET_HEIGHT + "px";

      document
        .getElementsByClassName("toOverlay")[0]
        .classList.add("extendedOverlay");
      if (myText.readOnly == true) console.log("here");
      setTimeout(() => {
        myText.readOnly = false;
      }, 300);
    },

    sendToServer(data) {
      //TODO: here should be adress to drafts
      Axios.post("", {});
    },
    resize() {
      var text = document.getElementById("myText");
      this.isPreviewReady = text.value !== "";
      text.style.height = "auto";
      text.style.height = text.scrollHeight + 1 + "px";
      this.currentSize = text.scrollHeight + 1 + "px";
    },
    delayedResize() {
      window.setTimeout(this.resize, 0);
    },
    initialSettings() {
      let realWidth = window.innerWidth;
      //  document.getElementById("main").clientWidth;
      // realWidth = 2000
      let realHeight = window.innerHeight;
      // document.getElementById("main").clientHeight;

      this.$store.dispatch("SET_SCREEN_WIDTH", { width: realWidth });
      this.$store.dispatch("SET_SCREEN_HEIGHT", { height: realHeight });

      if (localStorage.inputText) this.inputText = localStorage.inputText;
      // this.$smoothReflow({
      //   property: ["height", "width"],
      //   transition: "height .25s ease-in-out, width 5.75s ease-in-out",
      //   el: ".toOverlay"
      // });
      //   document.getElementById("fantomPage").style.width = realWidth
      // document.getElementById("fantomPage").style.height = realHeight
      // this.$store.getters.GET_WIDTH + "px";

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
    }
  },
  mounted() {
    this.getImgUrl()
    document.getElementById("ovr").classList.add("toOverlay");
    this.initialSettings();
  },
  computed: {
    size() {
      return this.$store.state.dataStorage.posts.length;
    },
    userSize() {
      return this.$store.state.dataStorage.userPosts.length;
    }
  },
  watch: {
    inputText(newText) {
      localStorage.inputText = newText;
    },
    size(newText) {
      this.initialSettings();
    },
    userSize(newText) {
      this.initialSettings();
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
svg:hover {
  fill: #428bff;
  cursor: pointer;
}
#submitButton {
  margin-right: 2%;
  margin-bottom: 1%;
  /* transition: all 1s ease-in-out; */
  /* -webkit-transition: all 1s ease-in-out;  */
  /* -moz-transition: all 1s ease-in-out;  */
  /* -o-transition: all 1s ease-in-out;  */
}

.addSmth {
  width: 15%;
  display: flex;
  justify-content: space-between;
  margin-right: 5px;

  align-content: center;
  margin-top: 4px;
}
.zeroOpacity {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: opacity 0.6s, visibility 0.6s linear 0.6s;
}

.oneOpacity {
  opacity: 1;
  visibility: visible;
  transition-delay: 3s;
}
.animate {
  transform: translate(0, -350px);
  -webkit-transform: translate(0, -350px);
  -o-transform: translate(0, -350px);
  -moz-transform: translate(0, -350px);
}

.text {
  -webkit-transition: height 0.5s ease;
  -moz-transition: height 0.5s ease;
  transition: height 0.5s ease;
}

.preview {
  color: #c8c8c8;
}
.preview:hover {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
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

textarea {
  /* height: 51px; */
  margin-top: 2px;

  border: none;
  resize: none;

  /* width: 65%; */
  z-index: 502;
  left: 60px;
  overflow-y: hidden;
}

#fantomPage {
  /* position: absolute; */
  position: fixed;
  height: 100vh;
  background-color: transparent;
  z-index: 400;
  top: 0;
  left: 0;
}
.appear {
  transition: opacity 0, 5s ease;
}

.toOverlay {
  /* display: inline-block; */
  background-color: white;
  width: 50%;
  position: absolute;
  z-index: 502;
  left: 70px;
  border: 2px solid black;
  transition-property: width height;
  /* height: 51px; */
  transition-duration: 0.75s;
}
.extendedOverlay {
  z-index: 500;
  outline: none !important;
  box-shadow: 0px 1px 8px 0px black;
  width: 60vw;
}

textarea:focus {
  outline: none !important;
  /* box-shadow: 0px 1px 8px 0px black; */
  /* width: 31vw; */
}
/* .post:after {
  content: "";
  width: 25vw;
  height: 242px;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 5%,
    rgba(255, 255, 255, 0) 40%
  );
  position: absolute;
  top: 0%;
} */

.attachments {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  /* position: absolute; */
}
.bottom-line {
  margin-top: 4px;
}
#send {
  width: 10vw;
  height: auto;
}

img {
  width: 51px;
  height: 51px;
}

@media screen and (max-width: 1200px) {
  textarea {
    /* width: 27vw !important; */
  }
  .toOverlay {
    /* width: 75%; */
  }
}

@media screen and (max-width: 767px) {
  textarea {
    width: 55vw !important;
  }
  .toOverlay {
    width: 65vw;
  }
}
</style>
