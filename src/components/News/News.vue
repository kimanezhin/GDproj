<template >
  <div class="row d-flex" v-if = "isDataFetched || isUserDataFetched" :class="flexBehaviour">
    <div id="imgCol" class="col-md-4 col-sm-12 mt-4">
      <post-editor/>
      <news-column v-if="isDataFetched" v-bind:posts="getPosts(0)"/>
      <news-column v-else-if="isUserDataFetched " class="ml-0" v-bind:posts="getPosts(0)"/>
    </div>
    <div class="col-md-4 ml-5 col-sm-12 text mt-4">
      <div v-if="!isDataFetched && !isUserDataFetched" id="ld" class="loading">
        <div class="loadText">{{ Loading}}</div>
        <!-- <img src="https://loading.io/spinners/coolors/lg.palette-rotating-ring-loader.gif" alt=""> -->
      </div>

      <news-column v-if="isDataFetched " class="ml-0" v-bind:posts="getPosts(1)"/>
      <news-column v-else-if="isUserDataFetched " class="ml-0" v-bind:posts="getPosts(1)"/>
    </div>
  </div>
</template>

<script>
import newsColumn from "./newsColumn";
import postEditor from "./postEditor";
import store from "./../../store/store.js";
export default {
  data() {
    return {
      Loading: "Loading"
    };
  },
  props: {
    posts: {
      type: Array,
      default: function() {
        return [];
      }
    },
    flexBehaviour: {
      type: String,
      default: "justify-content-around"
    }
  },
  computed: {
    isDataFetched() {
      return this.$store.state.dataStorage.isDataFetched;
    },
    postColumn(index){
      return this.posts.filter(post => post.num == index)
    },
    isUserDataFetched(){
      return this.$store.state.dataStorage.isUserDataFetched;
    }
  },
  components: {
    newsColumn,
    postEditor
  },
  mounted() {
    this.enableLoading();
  },
  methods: {
    getPosts(i) {
      return this.posts.filter(post => parseInt(post.num) == i);
    },
    enableLoading() {
      var count = 1;
      setInterval(() => {
        if (count % 4 != 0) {
          this.Loading += ".";
        } else {
          this.Loading = this.Loading.split("")
            .slice(0, this.Loading.length - 3)
            .join("");
        }
        count++;
      }, 400);
    }
  }
};
</script>
<style scoped>
#imgCol {
  min-width: 51px;
}
.loadText {
  font-size: 36px;
  font-weight: 500;
}
.loading {
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
