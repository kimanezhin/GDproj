<template>
  <div>
    <div name="list" tag="p" v-if="this.index != -3">
      <div class="mb-4 post" v-for="post in mPosts" :key="post.postId">
        <div class="postHeader mb-1">
          <img
            :src="getImgUrl(post.authorId)"
            v-bind:alt="post.authorId"
            class="rounded"
            :name="post.authorId"
            v-on:click="openUser($event)"
          >

          <div class="col">
            <div class="row">
              <div class="align-self-end ml-3 font-weight-bold">{{post.name}}</div>
            </div>
            <div class="row">
              <div class="ml-3 dateFont">{{transformTime(post.timeCreated)}}</div>
            </div>
          </div>
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
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 50 50"
            class="postButtons"
            version="1.1"
            width="50px"
            height="50px"
          >
            <g id="surface1">
              <path
                style=" "
                d="M 7 4 C 4.253906 4 2 6.253906 2 9 L 2 33 C 2 35.746094 4.253906 38 7 38 L 11.09375 38 C 11.230469 39.203125 11.214844 40.316406 10.90625 41.25 C 10.527344 42.398438 9.820313 43.363281 8.5 44.15625 C 8.128906 44.390625 7.957031 44.839844 8.070313 45.261719 C 8.183594 45.683594 8.5625 45.984375 9 46 C 13.242188 46 18.105469 43.785156 20.5625 38 L 43 38 C 45.746094 38 48 35.746094 48 33 L 48 9 C 48 6.253906 45.746094 4 43 4 Z M 7 6 L 43 6 C 44.65625 6 46 7.34375 46 9 L 46 33 C 46 34.65625 44.65625 36 43 36 L 20 36 C 19.582031 36 19.207031 36.261719 19.0625 36.65625 C 17.507813 40.898438 14.730469 42.917969 11.84375 43.65625 C 12.234375 43.097656 12.605469 42.507813 12.8125 41.875 C 13.332031 40.296875 13.289063 38.570313 12.96875 36.8125 C 12.878906 36.347656 12.476563 36.007813 12 36 L 7 36 C 5.34375 36 4 34.65625 4 33 L 4 9 C 4 7.34375 5.34375 6 7 6 Z "
              ></path>
            </g>
          </svg>
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
  beforeDestroy() {
    this.$eventHub.$off("feed-updated", this.updateFeed);
     this.$eventHub.$off('change-channel', this.changePosts)
  },
  // ../../../
  methods: {
    getImgUrl(id) {
      return require("../../../img/" + id + ".png");
    },
    transformTime(time) {
      //1861-08-13T00:00:08Z - not transformed
      //13.08.61 - transformed
      let tmp = time.split("-");
      tmp[2] = tmp[2].slice(0, 2);
      return tmp.reverse().join(".");
    },
    updateFeed(flag) {
      let arr = this.$store.getters.GET_POSTS;
      // let i = _.differenceBy(arr, this.mPosts, "postId")
      //   .sort((first, second) => {
      //     return second.postId - first.postId;
      //   });
     console.log(arr)
      // for (let post of arr) 
        // {
        //   console.log(post)
        //   this.mPosts.push(arr);
        // }
      // console.log(this.mPosts);
    },

    makeMarkDown(preText, name) {
      return marked(_.escape(preText));
    },
    openUser(event) {
      this.$router.push("/user/" + parseInt(event.target.name));
    },
    checkHashtagCount() {
      this.$nextTick(() => {
        let parent = document.getElementsByClassName("hashtags");

        var that = this;
        var arr = Array.from(parent);
        var myNode = "";

        arr.forEach(function(parentItem, index, arr) {
          var innerArray = Array.from(
            parentItem.getElementsByClassName("hash")
          );
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
      this.$nextTick(() => {
        var t = Array.from(document.getElementsByClassName("transit"));
        var texts = Array.from(document.getElementsByClassName("specialClass"));

        t.forEach((item, i) => {
          if (item.clientHeight >= 200) {
            texts[i].classList.add("constantSize");

            if (!texts[i].classList.contains("eventReady")) {
              texts[i].addEventListener("click", element => {
                console.log('a')
                item.classList.remove("toCrop");
                event.target.classList.remove("constantSize");
              });
              texts[i].classList.add("eventReady");
            }
            item.classList.add("toCrop");
          }
        });
      });
    },
    changePosts(){
      this.mPosts = this.$store.getters.GET_POSTS
    },
    channelFilter(p) {
      return true;
      if (
        !this.currentChannel ||
        !this.currentChannel.people ||
        !this.currentChannel.tags
      ) {
        console.log("Error in filter parsing");
        return true;
      }
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
    this.$eventHub.$on("feed-updated", this.updateFeed);
    this.$eventHub.$on('change-channel', this.changePosts)
    if(!localStorage.getItem('channel'))
    this.$store.dispatch("FETCH_DATA").then(() => {
      if (this.forUser) {
        let arr = this.$store.getters.GET_USER_POSTS;

        this.mPosts = arr;
        this.readMore();
      } else {
        let arr = this.$store.getters.GET_POSTS;
        // arr = _.uniqBy(arr, 'postId') // KOSTYLI!!!

        this.currentChannel = JSON.parse(localStorage.getItem("channel"));
          // arr = arr
          //   .sort((first, second) => {
          //     return second.postId - first.postId;
          //   });
        this.mPosts = arr;
      }
      let that = this;
      that.$nextTick(() => {
        this.checkHashtagCount();
        this.readMore();
      });
    });
    else{
      let ch = JSON.parse(localStorage.getItem('channel'))
      this.$store.dispatch("CHANGE_CHANNEL",ch ).then(() =>{
         this.mPosts = this.$store.getters.GET_POSTS;
      })
    }
  },
  watch: {
    isFetched: function(params) {
      // this.checkHashtagCount();
    },

    size: function(params) {
      // this.checkHashtagCount();
      // this.readMore();
    },
    userSize: function(params) {
      this.checkHashtagCount();
      this.readMore();
    },
    mPosts: function(newV, oldV) {
      var that = this;
      that.readMore();
    },
    getCurrentChannel: function(newValue, oldValue) {
      // this.currentChannel = newValue;
      // let arr = this.forUser
      //   ? this.$store.getters.GET_USER_POSTS
      //   : this.$store.getters.GET_POSTS;
      // if (_.isEqual(newValue, {})) {
      //   arr = arr.sort((first, second) => {
      //     return second.postId - first.postId;
      //   });
      // } else if (this.index == -1 && !this.forUser) {
        
      //   arr = arr
      //     .filter(p => this.channelFilter(p))
      //     .sort((first, second) => {
      //       return second.postId - first.postId;
      //     });
      // }
      // this.mPosts = arr;

      // this.readMore();
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
  line-height: 25.5;
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

.postButtons {
  /*
  //TODO: comment "display" 
  */
  display: none;
  height: 24px;
  width: 24px;
  stroke-width: 2;
  stroke: #8b8f97;
  opacity: 0.6;
}
.postButtons:hover {
  opacity: 1;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.dateFont {
  font-weight: 500;
  font-size: 12.5px;
  color: #939393;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.post {
  /* padding: 8px; */
  /* border: 1px solid #939393; */
  /* background-color: red; */
  width: 35vw;
  border-radius: 4px;
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
