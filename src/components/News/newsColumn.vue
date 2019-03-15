<template>
  <div>
    <div name="list" tag="p" v-if="this.index != -3">
      <div class="mb-4 post" v-for="post in mPosts" :key="post.postId">
        <div class="postHeader mb-1">
          <img src="../../../img/chern.jpg" :name="post.authorId" v-on:click="openUser($event)">
          <div class="align-self-end ml-3 font-weight-bold">{{post.name}}</div>

          <div
            style="margin-right:150px;"
            class="align-self-end ml-auto font-weight-bold"
          >{{transformTime(post.timeCreated)}}</div>
        </div>
        <div class="hashtags">
          <!-- <div v-on:mouseover="checkHashtagCount" class="hash">#smth</div> -->
          <div v-for="(tag,i) in post.tags" :key="i" class="hash">#{{ tag }}</div>
        </div>
        <div class="text specialClass">
          <div
            class="transit"
            :name="post.postId"
            v-html="makeMarkDown(post.postBody, post.postId)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueMarkdown from "vue-markdown";
import marked from "marked";
import _ from "lodash";
export default {
  data() {
    return {
      index: -1,
      currentChannel: {},
      mPosts: []
    };
  },
  components: {
    vueMarkdown,
    marked
  },
  props: {
    posts: {
      type: Array,
      default: function() {
        return [];
      }
    },
    columnNum: {
      type: Number
    },
    forUser: {
      type: Number
    }
  },
  methods: {
    transformTime(time) {
      //1861-08-13T00:00:08Z - not transformed
      //13.08.61 - transformed
      let tmp = time.split("-");
      tmp[2] = tmp[2].slice(0, 2);
      return tmp.reverse().join(".");
    },
    checkPosts() {
      console.log("Hello");
    },
    makeMarkDown(preText, name) {
      //document.getElementsByName(name).innerHTML =
      return marked(preText);
    },
    openUser(event) {
      this.$router.push("/user/" + parseInt(event.target.name));
    },
    checkHashtagCount() {
      let parent = document.getElementsByClassName("hashtags");

      var that = this;
      var arr = Array.from(parent);
      var myNode = "";

      arr.forEach(function(parentItem, index, arr) {
        var innerArray = Array.from(parentItem.getElementsByClassName("hash"));
        innerArray.forEach((item, i, arr) => {
          // item.classList.add('used')
          if (i > 4 && !item.classList.contains("used"))
            item.style.display = "none";
          if (i == 4 && !item.classList.contains("used")) {
            item.classList.add("used");
            var points = document.createElement("div");
            points.classList.add("pt");
            points.innerHTML = ". . .";
            parent[index].insertBefore(points, item);
            item.style.display = "none";
            //  item.innerHTML = ". . ."
            points.addEventListener("click", () => {
              // arr.forEach((item, i) => {
              that.showAllHashtags(parent, index, points, innerArray);
              // });
            });

            points.addEventListener("mouseover", () => {
              points.style.textDecoration = "underline";
              points.style.cursor = "pointer";
            });

            points.addEventListener("mouseout", () => {
              points.style.textDecoration = "none";
              points.style.cursor = "initial";
            });
          }
        });
      });
    },
    showAllHashtags(parent, index, points, innerArray) {
      parent[index].removeChild(points);
      innerArray.forEach((item, i) => {
        item.classList.remove("used");
        if (i > 4) {
          item.style.display = "initial";
        }
      });
    },
    readMore() {
      var t = Array.from(document.getElementsByClassName("transit"));
      var texts = Array.from(document.getElementsByClassName("specialClass"));
      t.forEach((item, i) => {
        if (item.clientHeight >= 200) {
          texts[i].classList.add("constantSize");

          if (!texts[i].classList.contains("eventReady")) {
            texts[i].addEventListener("click", element => {
              item.classList.remove("toCrop");
              event.target.classList.remove("constantSize");
            });
            texts[i].classList.add("eventReady");
          }
          item.classList.add("toCrop");
        }
      });
    },
    channelFilter(p) {
      return (
        this.currentChannel.people.includes(p.authorId) ||
        p.tags.some(x => this.currentChannel.tags.includes(x))
      );
    }
  },
  computed: {
    getCurrentChannel() {
      return this.$store.getters.GET_CURRENT_CHANNEL;
    },
    myPosts() {},
    getIndex: {
      get: function() {
        return this.index;
      },
      set: function(param) {
        this.index = param;
      }
    },
    isFetched() {
      return (
        this.$store.state.dataStorage.isDataFetched ||
        this.$store.state.dataStorage.isUserDataFetched
      );
    },
    size() {
      return this.$store.state.dataStorage.posts.length;
    },
    userSize() {
      return this.$store.state.dataStorage.userPosts.length;
    }
  },
  mounted() {
    if (this.forUser) {
      let arr = this.$store.getters.GET_USER_POSTS;
      console.log(arr);
      this.mPosts = arr;
      this.readMore();
    }

    let that = this;
    that.readMore();
    if (this.isFetched || that.forUser) {
      that.$nextTick(() => {
        this.checkHashtagCount();
        this.readMore();
        if (window.outerWidth < 768 || window.innerWidth < 768) {
          if (that.index == 1) that.index = -3;
          if (that.index == 0) that.index = -1;
          this.checkHashtagCount();
          that.readMore();
        }
      });
    } else console.log("(((");

    window.addEventListener("resize", function() {
      if (window.outerWidth < 768 || window.innerWidth < 768) {
        // that.firstArray = that.$options.propsData.posts;
        // console.log(that.getPosts(-1)
        if (that.index == 1) that.index = -3;
        if (that.index == 0) that.index = -1;
      } else {
        if (that.index == -3) that.index = 1;
        if (that.index == -1) that.index = 0;
      }
      that.readMore();
    });
  },
  watch: {
    isFetched: function(params) {
      console.log(params + "Hellllll");
      // this.checkHashtagCount();
    },
    size: function(params) {
      this.checkHashtagCount();
      this.readMore();
    },
    userSize: function(params) {
      this.checkHashtagCount();
      this.readMore();
    },
    getCurrentChannel: function(newValue, oldValue) {
      this.currentChannel = newValue;

      let arr = this.forUser
        ? this.$store.getters.GET_USER_POSTS
        : this.$store.getters.GET_POSTS;
      console.log(newValue);
      if (_.isEqual(newValue, {})) {
        console.log("here");
        arr = arr.sort((first, second) => {
          return second.postId - first.postId;
        });
      } else if (this.index == -1 && !this.forUser) {
        arr = arr
          .filter(p => this.channelFilter(p))
          .sort((first, second) => {
            return second.postId - first.postId;
          });
      }
      this.mPosts = arr;
      this.readMore();
    }
  }
};
</script>

<style scoped>
img:hover {
  cursor: pointer;
}
.hashtags {
  display: flex;
  flex-direction: row;
}
.constantSize {
  height: 200px;
  display: inline-block;
  border: 0px solid #aaa;
  position: relative;
  padding: 0px;
}

.constantSize::after {
  content: "Read more..";
  font-size: 16px !important;
  font-weight: 600;
  height: 100%;
  position: absolute;
  z-index: 100;
  bottom: 0px;
  width: 100%;
  /* background: transparent linear-gradient(rgba(255, 255, 255, 0), #fcfcfc) */
  /* repeat scroll 0% 0%; */
  line-height: 28;
  text-align: right;

  font-size: 12px;
  font-family: monospace;

  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=0 );
  background: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0%, rgba(255, 255, 255, 1)),
    color-stop(100%, rgba(255, 255, 255, 0))
  );
  background: -webkit-linear-gradient(
    bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  background: -moz-linear-gradient(
    bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  background: -ms-linear-gradient(
    bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  background: -o-linear-gradient(
    bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  background: linear-gradient(
    bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.constantSize:hover::after {
  text-decoration: underline;
}

.toCrop {
  clip: rect(0px, auto, 200px, 0px);
  position: absolute;
}

.hash {
  font-weight: 500;
  color: rgb(88, 137, 192);
  margin-left: 5px;
}
.hash:hover {
  text-decoration: underline;
  cursor: pointer;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 1s;
}
.text {
  width: 35vw;

  border-top: none;
}
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

@media screen and (max-width: 1200px) {
  #menu {
    display: none;
  }
  div {
    /* margin: 0; */
  }

  .text {
    width: 100vw;
  }

  .post {
    width: 85vw;
  }
  .transit {
    width: 85vw;
  }
}
</style>
