<template>
  <div>
    <div name="list" tag="p">
      <div class="mb-4 post" v-for="post in posts" :key="post.postId">
        <div class="postHeader mb-1">
          <img src="../../../img/chern.jpg" :name="post.authorId" v-on:click = "openUser($event)">
          <div class="align-self-end ml-3 font-weight-bold">{{post.name}}</div>
          <div class="align-self-end mr-3 ml-auto font-weight-bold">01.01.2019</div>
        </div>
        <div class="hashtags">
          <div v-on:mouseover="checkHashtagCount" class="hash">#smth</div>
          <div class="hash">#smth</div>
          <div class="hash">#smth</div>
          <div class="hash">#smth</div>
          <div class="hash">#smth</div>
          <div class="hash">#smth</div>
        </div>
        <div class="text specialClass">
          <!-- <vue-markdown> -->
          <!-- {{post.postBody}} -->
          <div
            class="transit"
            :name="post.postId"
            v-html="makeMarkDown(post.postBody, post.postId)"
          >
            <!-- {{makeMarkDown(post.postBody, post.postId)}} -->
          </div>
          <!-- </vue-markdown> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueMarkdown from "vue-markdown";
import marked from "marked";
export default {
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
    }
  },
  methods: {
    checkPosts() {
      console.log("Hello");
    },
    makeMarkDown(preText, name) {
      //document.getElementsByName(name).innerHTML =
      return marked(preText);
    },
    openUser(event){
      this.$router.push('/user/'+parseInt(event.target.name))
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
        if (item.clientHeight >= 100) {
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

      // var sm = document.getElementsByClassName("toCrop");
      // Array.from(sm).forEach(item => {
      //   if (item.clientHeight >= 100) {
      //     item.classList.add('constantSize')
      //   }
      // });
      // console.log(sm)

      //  console.log(t)
    }
  },
  computed: {
    isFetched() {
      return this.$store.state.dataStorage.isDataFetched;
    },
    size() {
      return this.$store.state.dataStorage.posts.length;
    },
    userSize(){
      return this.$store.state.dataStorage.userPosts.length;
    }
  },
  mounted() {
    if (this.isFetched) {
      var that = this;
      that.$nextTick(() => {
        this.checkHashtagCount();
      });
    } else console.log("(((");
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
    userSize: function (params) {
       this.checkHashtagCount();
      this.readMore();
    }
  }
};
</script>

<style scoped>
img:hover{
  cursor: pointer;
}
.hashtags {
  display: flex;
  flex-direction: row;
}
.constantSize {
  height: 100px;
  display: inline-block;
  border: 0px solid #aaa;
  position: relative;
  padding: 0px;
}

.constantSize::after {
  content: "Read more..";
  font-size: 16px !important;
  font-weight: 600;
  height: 70%;
  position: absolute;
  z-index: 100;
  bottom: 0px;
  width: 100%;
  background: transparent linear-gradient(rgba(255, 255, 255, 0), #fcfcfce0)
    repeat scroll 0% 0%;
  line-height: 10;
  text-align: right;
  /* text-align: center; */
  font-size: 12px;
  font-family: monospace;
}
.constantSize:hover::after {
  text-decoration: underline;
}

.toCrop {
  clip: rect(0px, auto, 100px, 0px);
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
