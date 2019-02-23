<template>
  <div>
    <transition-group name="list" tag="p">
      <div class="mb-4 post" v-for="post in posts" :key="post.postId">
        <div class="postHeader mb-1">
          <img src="../../../img/chern.jpg" alt>
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
        <div class="text">
          <div class="transit" v-readMore:300="post.postBody"></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
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
    checkHashtagCount() {
      // console.log(document
      //   .getElementsByClassName("hashtags"))
      let parent = document.getElementsByClassName("hashtags");
      var that = this;
      var arr = Array.from(parent);
      var myNode = "";
      arr.forEach(function(parentItem, index, arr) {
        var innerArray = Array.from(parentItem.getElementsByClassName("hash"));
        innerArray.forEach((item, i, arr) => {
          if (i > 4) item.style.display = "none";
          if (i == 4) {
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
        if (i > 4) {
          item.style.display = "initial";
        }
      });
      // var elem = parentItem.getElementsByClassName("pt")[0];
      // elem.style.display = "none";

      // var innerArray = Array.from(parentItem.getElementsByClassName("hash"));
      // innerArray.forEach((item, i) => {
      //   if (i > 4) {
      //     item.style.display = "initial";
      //   }
      // });
      // $(".hashTags .myHashTag").each(function(index, item) {
      //   if (parseInt($(item).data("index")) >= 4) {
      //     $(item).css({
      //       display: "initial"
      //     });
      //   }
      //   if (parseInt($(item).data("index")) == -1) {
      //     console.log($(item));
      //     $(item).html("");
      //   }
      // });
    }
  },
  mounted() {
    this.checkHashtagCount();
  }
};
</script>

<style scoped>
.hashtags {
  display: flex;
  flex-direction: row;
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
