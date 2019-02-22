<template >
  <div class="row d-flex justify-content-around">
    <div id = "imgCol" class="col-md-4 col-sm-12 mt-4">
      <post-editor v-if="isDataFetched"/>
      <news-column v-if="isDataFetched" v-bind:posts="posts"/>
    </div>
    <div class="col-md-4 ml-5 col-sm-12 text mt-4">
      <div v-if="!isDataFetched" id="ld" class="loading">
        <div class="loadText">{{ Loading}}</div>
        <!-- <img src="https://loading.io/spinners/coolors/lg.palette-rotating-ring-loader.gif" alt=""> -->
      </div>
     
      <news-column v-if="isDataFetched" class=" ml-0" v-bind:posts="posts"/>
     
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
    }
  },
  computed: {
    isDataFetched() {
      return this.$store.state.dataStorage.isDataFetched;
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
      return this.arr.filter(post => parseInt(post.num) == i);
    },
    enableLoading() {
      var count = 1;
      setInterval(() => {
        if (count % 4 != 0) {
          this.Loading += ".";
        } else {
          this.Loading = this.Loading.split("")
            .slice(0,this.Loading.length - 3)
            .join("");
        }
        count++;
      }, 400);
    }
  }
};
</script>
<style scoped>
#imgCol{
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
